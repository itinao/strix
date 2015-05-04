#
#       Table: m_site
#
# insert into m_site (title, detail, url, updated, created)values("Yahoo!", "yahoo", "http://www.yahoo.co.jp", now(), now());
# insert into m_site (title, detail, url, updated, created)values("Google!", "google", "http://google.com", now(), now());
CREATE TABLE `m_site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(128) DEFAULT NULL,
  `detail` text,
  `url` varchar(128) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
#       Table: site_info
#
CREATE TABLE `site_info` (
  `site_id` int(11) DEFAULT NULL,
  `title` text,
  `description` text,
  `image_base64` longtext,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`site_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
#       Table: har_data
#
CREATE TABLE `har_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) DEFAULT NULL,
  `har` text,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `site_id` (`site_id`,`created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
#       Table: yslow_data
#
CREATE TABLE `yslow_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) DEFAULT NULL,
  `har_data_id` int(11) NOT NULL,
  `yslow` text,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `har_data_id` (`har_data_id`),
  KEY `site_id` (`site_id`,`created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
