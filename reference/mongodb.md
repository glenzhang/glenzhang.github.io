# mongodb简易指导(windows参考)

##安装
1. 下载[mongo](http://www.mongodb.org/downloads)
2. 设置MongoDB目录
	* 将其解压到 `d:\`
	* 再重命名为`mongodb`，路径为`d:\mongodb`
3. 设置数据文件路径
	* 在`d`盘建一个`data`文件夹
	* 在`data`文件夹中新建`db`文件夹，路径`d:\data\db`
4. 启动MongoDB服务。进入`cmd`提示符控制台，

		cd d:\mongodb\bin\
		mongod.exe --dbpath=d:\data\db

5. 将MongoDB作为 Windows 服务随机启动
	*  创建D:\mongodb\logs\mongodb.log文件，用于存储MongoDB的日志文件, 
	*  安装系统服务：
	
			 cd d:\mongodb\bin 
			 mongod --dbpath=d:\data\db --logpath=d:\mongodb\logs\mongodb.log --install   
			 
		>all output going to: d:\mongodb\logs\mongodb.log  
		 Creating service MongoDB.  
		 Service creation successful.  
		>Service can be started from the command line via 'net start "MongoDB"'. 
		
		 	net start mongodb 
		>Mongo DB 服务已经启动成功。  
 

## mongo shell

**mongodb的shell其实就是javascript**
	
	> show dbs 显示所有的数据库
	> use dbname 切换数据库，如果数据库不存在就直接创建
	> show collections 显示当前数据库下的集合
	> db.[collectionname].find() 读集合数据
	> db.dropDatabase()  删除当前数据库
	> db.[collection].insert(BSON)   增加
	> db.[collection].find()   查找
    > db.[collection].count() 取得记录数量
	> db.[collection].update(condition, update document) 修改
	> db.[collection].remove(condition) 删除，这是一个不可撤回的操作，如果不带参数将清空整个集合，操作时务必加上查询条件

## gui管理工具
推荐[robomongo](http://www.robomongo.org/)