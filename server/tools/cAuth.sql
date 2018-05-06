/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `openId` varchar(100) DEFAULT NULL COMMENT '微信openId',
  `nickName` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatarUrl` varchar(255) DEFAULT NULL COMMENT '头像',
  `gender` char(1) DEFAULT NULL COMMENT '性别',
  `country` varchar(50) DEFAULT NULL COMMENT '国家',
  `province` varchar(50) DEFAULT NULL COMMENT '省',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `tomatoStartTime` datetime DEFAULT NULL COMMENT '番茄开始时间',
  `tomatoStatus` char(2) DEFAULT NULL COMMENT '番茄状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

CREATE TABLE `user_friend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user_id` int(11) DEFAULT NULL COMMENT '用户',
  `fk_friend_id` int(11) DEFAULT NULL COMMENT '朋友',
  `status` char(2) DEFAULT NULL COMMENT '状态',
  `createDate` datetime DEFAULT NULL,
  `updateDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='好友关系表';

CREATE TABLE `user_tomato` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `fk_user_id` int(11) DEFAULT NULL COMMENT '用户表外键',
  `fk_task_Id` int(11) DEFAULT NULL COMMENT '对应任务外键',
  `status` char(2) DEFAULT NULL COMMENT '番茄状态：成功、放弃、超时未确认、超时已确认',
  `create_date` datetime DEFAULT NULL COMMENT '创建时间',
  `end_date` datetime DEFAULT NULL COMMENT '番茄结束时间',
  `note` text COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户执行的番茄记录';

ALTER TABLE `user` ADD COLUMN `breakTime` int COMMENT '休息时长' , ADD COLUMN `tomatoTime` int COMMENT '番茄时长' ;
ALTER TABLE `user` CHANGE COLUMN `breakTime` `breakTime` int(11) DEFAULT 5 COMMENT '休息时长', CHANGE COLUMN `tomatoTime` `tomatoTime` int(11) DEFAULT 25 COMMENT '番茄时长';

SET FOREIGN_KEY_CHECKS = 1;
