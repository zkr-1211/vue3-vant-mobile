import Client from 'ssh2-sftp-client';
// SFTP 连接配置
const sftpConfig = {
  host: '111.230.15.162',
  port: '22',
  username: 'root',
  password: '@zkr116550',
};
// 上传最终的路径文件
const uploadFile = './dist';

// 平台
const platform = 'h5-payfly';

// 部署到远端的路径
const remotePath = `/home/polarday/${platform}/dist`;

// 备份远端文件夹路径
const backupFolder = `/home/polarday/${platform}/backup`;

// 作者
const author = 'CICD';

const sftp = new Client();

// 上传部署
async function deploy() {
  try {
    // 连接SFTP服务器
    await sftp.connect(sftpConfig);
    console.log('=====start=====');
    // 将整个文件夹上传到远端
    await sftp.uploadDir(uploadFile, remotePath);
    console.log('=====部署成功=====');
    console.log('=====end=====');
  } catch (error) {
    console.error('报错===', error.message);
  } finally {
    sftp.end();
  }
}
// 上传部署并备份
async function deployBackup() {
  try {
    // 连接SFTP服务器
    await sftp.connect(sftpConfig);
    // 备份文件夹路径
    console.log('=====start=====');
    // 判断远端 backup 文件夹是否存在，如果不存在，则创建
    const existsBackup = await sftp.exists(backupFolder);
    if (!existsBackup) {
      await sftp.mkdir(backupFolder);
    }
    // 获取当前时间戳，并根据时间戳生成备份目录名
    const timestamp = new Date().getTime();
    const backupName = `dist_${author}_${timestamp}`;
    // 判断远端 dist 文件夹是否存在，如果存在，则将其移动到备份文件夹中
    const existsDist = await sftp.exists(`${remotePath}`);
    if (existsDist) {
      // 将 dist 文件夹移动到备份目录
      const result = await sftp.rename(`${remotePath}`, `${backupFolder}/${backupName}`);
      if (result) {
        console.log('=====备份成功=====');
        // 获取备份文件夹列表
        const backupList = await sftp.list(backupFolder);
        if (backupList.length > 5) {
          // 对备份文件夹按照时间戳排序
          const sortedBackupList = backupList.sort((a, b) => {
            return a.modifyTime - b.modifyTime;
          });
          // 删除时间最久远的文件夹
          const oldestBackup = sortedBackupList[0].name;
          await sftp.rmdir(`${backupFolder}/${oldestBackup}`, true);
          console.log(`超过5个备份文件夹，删除了${oldestBackup}文件夹`);
        }
      } else {
        console.log('!!!备份失败!!!');
        return;
      }
    }
    // 将整个文件夹上传到远端
    await sftp.uploadDir(uploadFile, remotePath);
    console.log('=====部署成功=====');
    console.log('=====end=====');
  } catch (error) {
    console.error('报错===', error.message);
  } finally {
    sftp.end();
  }
}
// 回退
async function rollback() {
  try {
    // 连接 SFTP 服务器，判断备份文件夹是否存在
    await sftp.connect(sftpConfig);
    console.log('===回退开始===');
    const existsBackup = await sftp.exists(backupFolder);
    if (!existsBackup) {
      console.log('备份文件夹不存在');
      return;
    }

    // 获取备份文件夹下所有的文件夹和文件名，并按照时间戳从大到小排序，以便找到最近的备份
    const backups = await sftp.list(backupFolder);
    // 过滤出文件夹
    const backupFolders = backups.filter((item) => item.type === 'd');
    // 按照时间戳从大到小排序
    backupFolders.sort((a, b) => b.modifyTime - a.modifyTime);

    // 循环备份文件夹中的文件夹名字，找到最近的备份文件夹
    let latestBackupFolder = null;
    for (let i = 0; i < backupFolders.length; i++) {
      const folder = backupFolders[i];
      // 如果文件夹名字符合 dist_${author} 的格式，说明是我们部署时备份的文件夹
      if (folder.name.match(`^dist_${author}`).length) {
        latestBackupFolder = folder;
        break;
      }
    }

    // 如果找到最近的备份文件夹，则根据其名字将文件夹重命名为 dist，即回退到该备份状态
    if (latestBackupFolder) {
      // 删除原先的 dist 文件夹
      const existsDist = await sftp.exists(remotePath);
      if (existsDist) {
        const result = await sftp.rmdir(remotePath, true);
        if (!result) {
          console.log('!!!删除 dist 文件夹失败!!!');
          return;
        }
      }
      const result = await sftp.rename(`${backupFolder}/${latestBackupFolder.name}`, remotePath);
      if (result) {
        console.log('=====回退成功=====');
      } else {
        console.log('!!!回退失败!!!');
      }
    } else {
      console.log('未找到备份文件夹');
    }
  } catch (error) {
    console.error('报错===', error.message);
  } finally {
    sftp.end();
  }
}
// 获取命令行参数，确定要执行的操作
const command = process.argv[2];
if (command === 'deploy') {
  deploy();
} else if (command === 'deployBackup') {
  deployBackup();
} else if (command === 'rollback') {
  rollback();
} else {
  console.log('请在命令行中输入正确的指令：deploy 或 deployBackup 或 rollback');
}
