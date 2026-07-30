-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : jeu. 30 juil. 2026 à 07:51
-- Version du serveur : 5.7.39
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `flower`
--

-- --------------------------------------------------------

--
-- Structure de la table `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `instance_id` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `place_id` int(11) DEFAULT NULL,
  `contact_1_id` int(11) DEFAULT NULL,
  `revenue` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `account`
--

INSERT INTO `account` (`id`, `instance_id`, `status`, `place_id`, `contact_1_id`, `revenue`, `visibility`, `touched_at`, `touched_by`) VALUES
(2, 1, 'active', 1, 1, '1000.2', 'active', '2024-04-01 19:10:51', NULL),
(8, 1, 'new', 2, 2, '5000', 'active', '2024-04-01 00:00:00', NULL),
(9, 1, 'new', 2, 3, '10000', 'active', '2024-04-01 22:00:00', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `audit`
--

CREATE TABLE `audit` (
  `id` int(11) NOT NULL,
  `year` char(4) DEFAULT NULL,
  `month` char(7) DEFAULT NULL,
  `entity` varchar(255) DEFAULT NULL,
  `row_id` int(11) DEFAULT NULL,
  `property` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `audit`
--

INSERT INTO `audit` (`id`, `year`, `month`, `entity`, `row_id`, `property`, `value`, `visibility`, `touched_at`, `touched_by`) VALUES
(10, '2023', '2023-04', 'candidat', 1, 'place_id', '2', 'active', '2024-04-14 14:12:27', 1),
(11, '2023', '2023-04', 'candidat', 1, 'place_id', '1', 'active', '2024-04-14 16:14:38', 2),
(12, '2023', '2023-04', 'candidat', 1, 'status', 'repondeur', 'active', '2024-04-14 22:51:44', 3),
(13, '2023', '2023-04', 'candidat', 1, 'status', 'new', 'active', '2024-04-14 22:51:56', 4),
(14, '2023', '2023-05', 'candidat', 2, 'status', 'repondeur', 'active', '2024-04-14 22:51:44', 5),
(15, '2023', '2023-05', 'candidat', 3, 'status', 'repondeur', 'active', '2024-04-14 22:51:44', 6),
(16, '2023', '2023-06', 'candidat', 1, 'status', 'repondeur', 'active', '2024-04-14 22:51:44', 7),
(17, '2023', '2023-06', 'candidat', 1, 'status', 'repondeur', 'active', '2024-04-14 22:51:44', 8),
(18, '2023', '2023-06', 'candidat', 1, 'status', 'new', 'active', '2024-04-14 22:51:56', 9),
(19, '2023', '2023-07', 'candidat', 1, 'status', 'a_relancer', 'active', '2024-04-14 22:51:44', 10),
(20, '2023', '2023-07', 'candidat', 1, 'status', 'candidate', 'active', '2024-04-14 22:51:44', 11),
(21, '2023', '2023-07', 'candidat', 1, 'status', 'nouvelle_candidature', 'active', '2024-04-14 22:51:44', 12),
(22, '2023', '2023-07', 'candidat', 1, 'status', 'entretien_programme', 'active', '2024-04-14 22:51:44', 13),
(23, '2024', '2024-04', 'candidat', 1, 'place_id', '2', 'active', '2024-04-14 14:12:27', 14),
(24, '2024', '2024-04', 'candidat', 1, 'place_id', '1', 'active', '2024-04-14 16:14:38', 15),
(25, '2024', '2024-04', 'candidat', 1, 'status', 'repondeur', 'active', '2024-04-14 22:51:44', 16),
(26, '2024', '2024-04', 'candidat', 1, 'status', 'new', 'active', '2024-04-14 22:51:56', 17),
(27, '2024', '2024-05', 'candidat', 2, 'status', 'new', 'active', '2024-04-14 22:51:44', 18),
(28, '2024', '2024-05', 'candidat', 3, 'status', 'new', 'active', '2024-04-14 22:51:44', 19),
(29, '2024', '2024-06', 'candidat', 1, 'status', 'repondeur', 'active', '2024-04-14 22:51:44', 20),
(30, '2024', '2024-06', 'candidat', 1, 'status', 'repondeur', 'active', '2024-04-14 22:51:44', 21),
(31, '2024', '2024-06', 'candidat', 1, 'status', 'new', 'active', '2024-04-14 22:51:56', 1),
(32, '2024', '2024-07', 'candidat', 1, 'status', 'a_relancer', 'active', '2024-04-14 22:51:44', 2),
(33, '2024', '2024-07', 'candidat', 1, 'status', 'candidate', 'active', '2024-04-14 22:51:44', 3),
(34, '2024', '2024-07', 'candidat', 1, 'status', 'nouvelle_candidature', 'active', '2024-04-14 22:51:44', 4),
(35, '2024', '2024-07', 'candidat', 1, 'status', 'entretien_programme', 'active', '2024-04-14 22:51:44', 5),
(36, '2024', '2024-04', 'candidat', 1, 'place_id', '2', 'active', '2024-04-14 14:12:27', 6),
(37, '2024', '2024-04', 'candidat', 1, 'place_id', '1', 'active', '2024-04-14 16:14:38', 7),
(38, '2024', '2024-04', 'candidat', 1, 'status', 'repondeur', 'active', '2024-04-14 22:51:44', 8),
(39, '2024', '2024-07', 'candidat', 1, 'status', 'entretien_programme', 'active', '2024-04-14 22:51:44', 9);

-- --------------------------------------------------------

--
-- Structure de la table `candidat`
--

CREATE TABLE `candidat` (
  `id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT '',
  `stage` varchar(255) DEFAULT '',
  `school` varchar(255) DEFAULT '',
  `place_id` int(11) DEFAULT '0',
  `school_year` varchar(255) DEFAULT '',
  `level` varchar(255) DEFAULT '',
  `boarding_school` varchar(255) DEFAULT '',
  `owner_id` int(11) DEFAULT '0',
  `identifier` varchar(255) DEFAULT '',
  `email_work` varchar(255) DEFAULT '',
  `contact_1_id` int(11) DEFAULT '0',
  `contact_2_id` int(11) DEFAULT '0',
  `contact_2_role` varchar(255) DEFAULT '',
  `contact_3_id` int(11) DEFAULT '0',
  `contact_3_role` varchar(255) DEFAULT '',
  `family_situation` tinyint(4) DEFAULT '0',
  `school_situation` tinyint(4) DEFAULT '0',
  `current_level` varchar(255) DEFAULT '',
  `journey` varchar(255) DEFAULT '',
  `opening_date` date DEFAULT NULL,
  `callback_date` date DEFAULT NULL,
  `next_meeting_date` date DEFAULT NULL,
  `next_meeting_time` time DEFAULT NULL,
  `subscription_date` date DEFAULT NULL,
  `cancellation_date` date DEFAULT NULL,
  `origine` varchar(255) DEFAULT '',
  `web_query` mediumtext,
  `amount` decimal(14,4) DEFAULT '0.0000',
  `default_means_of_payment` varchar(255) DEFAULT '',
  `transfer_order_id` varchar(255) DEFAULT '0',
  `transfer_order_date` date DEFAULT NULL,
  `bank_identifier` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0',
  `discipline` varchar(255) DEFAULT '',
  `discipline_level` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `candidat`
--

INSERT INTO `candidat` (`id`, `status`, `stage`, `school`, `place_id`, `school_year`, `level`, `boarding_school`, `owner_id`, `identifier`, `email_work`, `contact_1_id`, `contact_2_id`, `contact_2_role`, `contact_3_id`, `contact_3_role`, `family_situation`, `school_situation`, `current_level`, `journey`, `opening_date`, `callback_date`, `next_meeting_date`, `next_meeting_time`, `subscription_date`, `cancellation_date`, `origine`, `web_query`, `amount`, `default_means_of_payment`, `transfer_order_id`, `transfer_order_date`, `bank_identifier`, `visibility`, `touched_at`, `touched_by`, `discipline`, `discipline_level`) VALUES
(1, 'new', '', 'bts_ndrc', 1, '2024-2025', 'bts_1', 'interne', 1, 'gclid_xxx', '', 1, 18, '', NULL, '', 0, 0, '1_generale', '', '2024-04-01', '2024-04-03', '2024-04-05', NULL, NULL, NULL, 'web', NULL, '203.0000', '', '', NULL, '', 'active', '2024-04-14 22:51:56', NULL, 'football', ''),
(2, 'new', '', 'bts_ndrc', 2, '2024-2025', 'bts_2', 'demi', 2, 'gclid_xxx', '', 2, NULL, '', NULL, '', 0, 0, '1_generale', '', '2024-04-01', '2024-04-03', '2024-04-05', NULL, NULL, NULL, 'web', NULL, '127.0000', '', '', NULL, '', 'active', '2024-04-03 13:29:08', NULL, 'football', ''),
(3, 'a_relancer', '', 'bts_com', 2, '2024-2025', 'bts_1', 'interne', 3, 'gclid_xxx', '', 3, NULL, '', NULL, '', 0, 0, '2', '', '2024-04-01', '2024-04-03', '2024-04-05', NULL, NULL, NULL, 'web', NULL, '448.0000', '', '', NULL, '', 'active', '2024-04-03 13:29:08', NULL, 'basketball', ''),
(4, 'candidate', '', 'bachelor_business_development', 1, '2024-2025', 'b1', 'externe', 4, 'gclid_xxx', '', 4, NULL, '', NULL, '', 0, 0, '2', '', '2024-04-01', '2024-04-03', '2024-04-05', NULL, NULL, NULL, 'web', NULL, '2000.0000', '', '', NULL, '', 'active', '2024-04-03 13:29:08', NULL, 'tennis', ''),
(5, 'nouvelle_candidature', '', 'bachelor_business_development', 1, '2024-2025', 'b2', 'externe', 5, 'gclid_xxx', '', 4, NULL, '', NULL, '', 0, 0, '2', '', '2024-04-01', '2024-04-03', '2024-04-05', NULL, NULL, NULL, 'facebook', NULL, '2000.0000', '', '', NULL, '', 'active', '2024-04-03 13:29:08', NULL, 'tennis', '');

-- --------------------------------------------------------

--
-- Structure de la table `config_property`
--

CREATE TABLE `config_property` (
  `id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT '',
  `entity` varchar(255) DEFAULT '',
  `property_id` varchar(255) DEFAULT '',
  `definition` mediumtext,
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `config_property`
--

INSERT INTO `config_property` (`id`, `status`, `entity`, `property_id`, `definition`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'active', 'candidat', 'school_year', '{ \r\n    \"definition\": \"inline\",\r\n    \"type\": \"select\",\r\n    \"modalities\": {\r\n        \"2022-2023\": { \"default\": \"2022-2023\" },\r\n        \"2023-2024\": { \"default\": \"2023-2024\" },\r\n        \"2024-2025\": { \"default\": \"2024-2025\" },\r\n        \"2025-2026\": { \"default\": \"2025-2026\" },\r\n        \"2026-2027\": { \"default\": \"2026-2027\" },\r\n        \"2027-2028\": { \"default\": \"2027-2028\" }\r\n    },\r\n    \"labels\": {\r\n        \"default\": \"Année scolaire\"\r\n    }\r\n}', 'active', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `text` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `contact`
--

INSERT INTO `contact` (`id`, `account_id`, `text`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 2, 'Formulaire site web : contact\r\nFootball, La Queue-En-Brie, Terminale générale', 'active', '2024-04-08 13:24:16', 4),
(2, 2, 'Appelé, il est intéressé\r\nCommentaires d\'entretien...', 'active', '2024-04-02 13:24:16', 3);

-- --------------------------------------------------------

--
-- Structure de la table `document`
--

CREATE TABLE `document` (
  `id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT '',
  `folder` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `mime` varchar(255) DEFAULT '',
  `version` varchar(255) DEFAULT '',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `document`
--

INSERT INTO `document` (`id`, `type`, `folder`, `name`, `mime`, `version`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'structured', 'Tests', 'Test dataset v2', 'application/json', '1', 'active', '2026-05-13 17:50:29', 1),
(2, 'structured', 'Tests', 'Test dataset v2', 'application/json', '1', 'active', '2026-05-13 17:50:29', 1);

-- --------------------------------------------------------

--
-- Structure de la table `document_cell`
--

CREATE TABLE `document_cell` (
  `id` int(11) NOT NULL,
  `identifier` varchar(255) DEFAULT '',
  `level` int(11) DEFAULT '0',
  `parent` varchar(255) DEFAULT '',
  `predecessor` varchar(255) DEFAULT '',
  `content` mediumtext,
  `document_id` int(11) DEFAULT '0',
  `is_canceled` tinyint(4) DEFAULT '0',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `document_cell`
--

INSERT INTO `document_cell` (`id`, `identifier`, `level`, `parent`, `predecessor`, `content`, `document_id`, `is_canceled`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'header', 0, '', '', '{\"reference\":\"DEVIS-2026-001\",\"date\":\"2024-06-01\",\"client_id\":1,\"name\":\"Offre commerciale – Solutions IT sur mesure\",\"description\":\"Nous vous remercions pour votre confiance et l’opportunité de vous proposer une offre adaptée à vos besoins en solutions IT.<br>Notre entreprise, spécialisée dans le Service Desk, le développement logiciel, et l’infrastructure IT, vous propose les prestations suivantes\",\"clients\":[{\"id\":1,\"label\":\"Client 1 - 25 rue du Faubourg du Temple, 75010 PARIS\"},{\"id\":2,\"label\":\"Client 2 - xxxxx, xxxxx xxxxx\"},{\"id\":3,\"label\":\"Client 3 - xxxxx, xxxxx xxxxx\"}]}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(2, 'support_utilisateurs', 1, 'header', '', '{\"name\":\"A. Support utilisateurs\",\"description\":\"Lorem ipsum...\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(3, 'support_niveau_1', 2, 'support_utilisateurs', '', '{\"section\":\"support_utilisateurs\",\"type\":\"Utilisateur x mois\",\"name\":\"Support Niveau 1\",\"description\":\"Assistance technique (tickets, appels, emails) – 8h/5j\",\"price\":50,\"unit\":\"Utilisateur x mois\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(4, 'support_niveau_2', 2, 'support_utilisateurs', 'support_niveau_1', '{\"section\":\"support_utilisateurs\",\"type\":\"Utilisateur x mois\",\"name\":\"Support Niveau 2\",\"price\":80,\"unit\":\"Utilisateur x mois\",\"description\":\"Résolution avancée (escalade, diagnostics) – 8h/5j\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(5, 'support_24_7', 2, 'support_utilisateurs', 'support_niveau_2', '{\"section\":\"support_utilisateurs\",\"type\":\"check\",\"name\":\"OPTION Support 24/7\",\"price\":1000,\"unit\":\"Forfait\",\"adjustable\":true,\"description\":\"Disponibilité étendue (soirs, week-ends, jours fériés)\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(6, 'developpement_logiciel', 1, 'header', 'support_utilisateurs', '{\"name\":\"B. Développement logiciel\",\"description\":\"Lorem ipsum...\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(7, 'application_web_sur_mesure', 2, 'developpement_logiciel', '', '{\"section\":\"developpement_logiciel\",\"type\":\"check\",\"name\":\"Application web sur mesure\",\"price\":15000,\"unit\":\"Forfait\",\"description\":\"Développement d’une application métiers (back-end + front-end)\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(8, 'maintenance_evolutive', 2, 'developpement_logiciel', 'application_web_sur_mesure', '{\"section\":\"developpement_logiciel\",\"type\":\"Mois\",\"name\":\"Maintenance évolutive\",\"price\":1500,\"unit\":\"Mois\",\"description\":\"Mises à jour, correctifs, ajout de fonctionnalités (10h/mois)\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(9, 'hebergement', 2, 'developpement_logiciel', 'maintenance_evolutive', '{\"section\":\"developpement_logiciel\",\"type\":\"Mois\",\"name\":\"OPTION Hébergement\",\"price\":300,\"unit\":\"Mois\",\"adjustable\":true,\"description\":\"Hébergement cloud sécurisé (AWS/Azure) + sauvegardes automatiques\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(10, 'infrastructure_it', 1, 'header', 'developpement_logiciel', '{\"name\":\"C. Infrastructure IT\",\"description\":\"Lorem ipsum...\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(11, 'audit_securite', 2, 'infrastructure_it', '', '{\"section\":\"infrastructure_it\",\"type\":\"check\",\"name\":\"Audit sécurité\",\"price\":2500,\"unit\":\"Forfait\",\"description\":\"Analyse des vulnérabilités et recommandations\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(12, 'migration_cloud', 2, 'infrastructure_it', 'audit_securite', '{\"section\":\"infrastructure_it\",\"type\":\"check\",\"name\":\"Migration vers le cloud\",\"price\":2500,\"unit\":\"Forfait\",\"description\":\"Migration des serveurs locaux vers une solution cloud (Azure/AWS)\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(13, 'sauvegarde', 2, 'infrastructure_it', 'migration_cloud', '{\"section\":\"infrastructure_it\",\"type\":\"Mois\",\"name\":\"OPTION Sauvegarde\",\"price\":200,\"unit\":\"Mois\",\"adjustable\":true,\"description\":\"Solution de sauvegarde externalisée (1To de stockage)\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(14, 'virtualisation_securisation_poste_travail', 1, 'header', 'infrastructure_it', '{\"name\":\"D. Virtualisation et sécurisation du poste de travail\",\"description\":\"Lorem ipsum...\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(15, 'virtualisation_vm', 2, 'virtualisation_securisation_poste_travail', '', '{\"section\":\"virtualisation_securisation_poste_travail\",\"type\":\"VM\",\"name\":\"Virtualisation (VM)\",\"price\":200,\"unit\":\"VM\",\"description\":\"Mise en place de machines virtuelles (VMware/Proxmox)\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(16, 'stockage_nas', 2, 'virtualisation_securisation_poste_travail', 'virtualisation_vm', '{\"section\":\"virtualisation_securisation_poste_travail\",\"type\":\"check\",\"name\":\"Stockage NAS\",\"price\":1500,\"unit\":\"NAS\",\"description\":\"Solution de stockage réseau sécurisé (Synology/QNAP) avec 10 To de capacité.\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(17, 'antivirus_entreprise', 2, 'virtualisation_securisation_poste_travail', 'stockage_nas', '{\"section\":\"virtualisation_securisation_poste_travail\",\"type\":\"Licences par an\",\"name\":\"Sécurité défensive : EDR\",\"price\":30,\"unit\":\"Licence annuelle\",\"description\":\"Protection avancée contre les malwares et ransomwares (Bitdefender/Kaspersky).\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(18, 'filtrage_dns', 2, 'virtualisation_securisation_poste_travail', 'antivirus_entreprise', '{\"section\":\"virtualisation_securisation_poste_travail\",\"type\":\"check\",\"name\":\"Sécurité défensive : Filtrage DNS\",\"lockedTo\":\"antivirus_entreprise\",\"price\":25,\"unit\":\"Forfait\",\"description\":\"Ce produit est obligatoirement associé au produit Sécurité défensive : EDR\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(19, 'sauvegardes_automatiques', 2, 'virtualisation_securisation_poste_travail', 'filtrage_dns', '{\"section\":\"virtualisation_securisation_poste_travail\",\"type\":\"Par an\",\"name\":\"Sauvegardes automatiques\",\"price\":400,\"unit\":\"Annuelle\",\"description\":\"Solution de sauvegarde incrémentielle et chiffrée (Veeam/BackupPC) sur site ou cloud.\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(20, 'chiffrement_donnees', 2, 'virtualisation_securisation_poste_travail', 'sauvegardes_automatiques', '{\"section\":\"virtualisation_securisation_poste_travail\",\"type\":\"check\",\"name\":\"OPTION Chiffrement des données\",\"price\":800,\"unit\":\"Forfait\",\"adjustable\":true,\"description\":\"Chiffrement complet des postes de travail et des sauvegardes (BitLocker/Veracrypt).\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(21, 'demarrage', 3, 'header', '', '{\"name\":\"DÉMARRAGE\",\"description\":\"Lorem ipsum...\",\"currentPrice\":0,\"clientValue\":\"computed\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(22, 'intermediaire', 3, 'header', 'demarrage', '{\"name\":\"INTERMÉDIAIRE\",\"description\":\"Lorem ipsum...\",\"currentPrice\":0,\"clientValue\":\"computed\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(23, 'complet', 3, 'header', 'intermediaire', '{\"name\":\"COMPLET\",\"description\":\"Lorem ipsum...\",\"currentPrice\":null,\"clientValue\":\"computed\"}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(24, '1', 4, 'demarrage,support_niveau_1', '', '{\"value\":3}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(25, '2', 4, 'intermediaire,support_niveau_1', '', '{\"value\":3}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(26, '3', 4, 'complet,support_niveau_1', '', '{\"value\":3}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(27, '4', 4, 'intermediaire,support_niveau_2', '', '{\"value\":3}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(28, '5', 4, 'complet,support_niveau_2', '', '{\"value\":3}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(29, '6', 4, 'complet,support_24_7', '', '{\"value\":true}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(30, '7', 4, 'complet,application_web_sur_mesure', '', '{\"value\":true}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(31, '8', 4, 'complet,maintenance_evolutive', '', '{\"value\":12}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(32, '9', 4, 'complet,hebergement', '', '{\"value\":12}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(33, '10', 4, 'demarrage,audit_securite', '', '{\"value\":true}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(34, '11', 4, 'intermediaire,audit_securite', '', '{\"value\":true}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(35, '12', 4, 'complet,audit_securite', '', '{\"value\":true}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(36, '13', 4, 'intermediaire,migration_cloud', '', '{\"value\":true}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(37, '14', 4, 'complet,migration_cloud', '', '{\"value\":true}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(38, '15', 4, 'demarrage,sauvegarde', '', '{\"value\":12}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(39, '16', 4, 'intermediaire,sauvegarde', '', '{\"value\":12}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(40, '17', 4, 'complet,sauvegarde', '', '{\"value\":12}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(41, '18', 4, 'demarrage,virtualisation_vm', '', '{\"value\":3}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(42, '19', 4, 'intermediaire,virtualisation_vm', '', '{\"value\":6}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(43, '20', 4, 'complet,virtualisation_vm', '', '{\"value\":9}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(44, '21', 4, 'complet,stockage_nas', '', '{\"value\":true}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(45, '22', 4, 'demarrage,antivirus_entreprise', '', '{\"value\":3}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(46, '29', 4, 'demarrage,filtrage_dns', '', '{\"value\":3}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(47, '23', 4, 'intermediaire,antivirus_entreprise', '', '{\"value\":6}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(48, '30', 4, 'intermediaire,filtrage_dns', '', '{\"value\":6}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(49, '24', 4, 'complet,antivirus_entreprise', '', '{\"value\":9}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(50, '31', 4, 'complet,filtrage_dns', '', '{\"value\":9}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(51, '25', 4, 'demarrage,sauvegardes_automatiques', '', '{\"value\":3}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(52, '26', 4, 'intermediaire,sauvegardes_automatiques', '', '{\"value\":6}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(53, '27', 4, 'complet,sauvegardes_automatiques', '', '{\"value\":9}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(54, '28', 4, 'complet,chiffrement_donnees', '', '{\"value\":true}', 1, 0, 'active', '2026-05-13 17:50:29', 1),
(55, 'demarrage', 3, 'header', '', '{\"name\":\"STANDARD\",\"description\":\"Lorem ipsum...\",\"currentPrice\":0,\"clientValue\":\"computed\"}', 2, 0, 'active', '2026-05-13 17:50:29', 1),
(56, 'header', 0, '', '', '{\"reference\":\"DEVIS-2026-001\",\"date\":\"2024-06-01\",\"client_id\":1,\"name\":\"Lorem Ipsum...\",\"description\":\"Lorem Ipsum...\"}', 2, 0, 'active', '2026-05-13 17:50:29', 1),
(58, 'support_utilisateurs', 1, 'header', '', '{\"name\":\"A.\",\"description\":\"Lorem ipsum...\"}', 2, 0, 'active', '2026-05-13 17:50:29', 1);

-- --------------------------------------------------------

--
-- Structure de la table `entreprise`
--

CREATE TABLE `entreprise` (
  `id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `sector` varchar(255) DEFAULT '',
  `school` varchar(255) DEFAULT '',
  `place_id` int(11) DEFAULT '0',
  `owner_id` int(11) DEFAULT '0',
  `contact_1_id` int(11) DEFAULT '0',
  `opening_date` date DEFAULT NULL,
  `callback_date` date DEFAULT NULL,
  `next_meeting_date` date DEFAULT NULL,
  `origine` varchar(255) DEFAULT '',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `entreprise`
--

INSERT INTO `entreprise` (`id`, `status`, `name`, `sector`, `school`, `place_id`, `owner_id`, `contact_1_id`, `opening_date`, `callback_date`, `next_meeting_date`, `origine`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'new', '', '', 'bts_mco', 1, 1, 1, '2024-09-03', '2024-09-04', '2024-09-08', 'jpo', 'active', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `caption` varchar(255) DEFAULT '',
  `date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT '',
  `visibility` char(8) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `event`
--

INSERT INTO `event` (`id`, `caption`, `date`, `start_time`, `end_date`, `end_time`, `location`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'Admission TEST Test', '2024-09-03', '09:30:00', NULL, '11:00:00', '', 'active', NULL, 0),
(2, 'Admission TEST2 Test2', '2024-09-04', '11:30:00', NULL, '13:00:00', '', 'active', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `finance_account`
--

CREATE TABLE `finance_account` (
  `id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `invoice_contact_id` int(11) DEFAULT '0',
  `vat_identifier` varchar(255) DEFAULT NULL,
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0',
  `invoice_address_id` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `finance_account`
--

INSERT INTO `finance_account` (`id`, `type`, `name`, `invoice_contact_id`, `vat_identifier`, `visibility`, `touched_at`, `touched_by`, `invoice_address_id`) VALUES
(1, 'company', 'Entreprise 3', 1, 'FR50999999999', 'active', '2024-07-02 21:13:25', 83, 29),
(2, 'company', 'Entreprise 1', 2, 'FR50999999999', 'active', '2024-07-02 21:13:25', 83, 29),
(3, 'company', 'Entreprise 2', 3, 'FR50999999999', 'active', '2024-07-02 21:13:25', 83, 29),
(4, 'company', 'OPCO Atlas', 4, 'FR50999999999', 'active', '2024-07-02 21:13:25', 83, 29);

-- --------------------------------------------------------

--
-- Structure de la table `finance_audit`
--

CREATE TABLE `finance_audit` (
  `id` int(11) NOT NULL,
  `entity` varchar(255) DEFAULT '',
  `row_id` int(11) DEFAULT '0',
  `property` varchar(255) DEFAULT '',
  `value` varchar(255) DEFAULT '',
  `previous_value` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `finance_audit`
--

INSERT INTO `finance_audit` (`id`, `entity`, `row_id`, `property`, `value`, `previous_value`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'finance_catalogue', 1, 'tax_type', '2', '1', 'active', '2025-11-16 21:25:56', 1);

-- --------------------------------------------------------

--
-- Structure de la table `finance_catalogue`
--

CREATE TABLE `finance_catalogue` (
  `id` int(11) NOT NULL,
  `identifier` varchar(255) DEFAULT '',
  `description` mediumtext,
  `unit_price` varchar(255) DEFAULT '',
  `tax_type` tinyint(4) DEFAULT '0',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `finance_catalogue`
--

INSERT INTO `finance_catalogue` (`id`, `identifier`, `description`, `unit_price`, `tax_type`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'scolarite_b1_ia', 'Scolarité Bachelor 1 IA', '5000', 2, 'active', '2025-11-16 21:25:56', 1),
(12, 'scolarite_b3_ia', 'Scolarité Bachelor 3 IA', '6000', 1, 'active', '2024-06-30 14:46:11', 83),
(13, 'scolarite_m1_ia', 'Scolarité Mastère 1 IA', '6000', 1, 'active', '2024-06-30 14:46:11', 83),
(14, 'scolarite_b2_ia', 'Scolarité Bachelor 2 IA', '5500', 1, 'active', '2024-06-30 14:46:11', 83),
(15, 'scolarite_m2_ia', 'Scolarité Mastère 2 IA', '6000', 1, 'active', '2024-06-30 14:46:11', 83),
(16, 'admission', 'Admission', '1500', 1, 'active', '2024-06-30 14:46:11', 83);

-- --------------------------------------------------------

--
-- Structure de la table `finance_commitment`
--

CREATE TABLE `finance_commitment` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `reference` varchar(255) DEFAULT '',
  `status` varchar(255) DEFAULT '',
  `description` mediumtext,
  `vendor` varchar(255) DEFAULT '',
  `due_date` date DEFAULT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `markup` decimal(14,4) DEFAULT '0.0000',
  `funding` varchar(255) DEFAULT '',
  `duration` varchar(255) DEFAULT '',
  `global_amount` decimal(14,4) DEFAULT '0.0000',
  `vat_free_base` decimal(14,4) DEFAULT '0.0000',
  `standard_vat_base` decimal(14,4) DEFAULT '0.0000',
  `standard_vat_amount` decimal(14,4) DEFAULT '0.0000',
  `intermediary_vat_base` decimal(14,4) DEFAULT '0.0000',
  `intermediary_vat_amount` decimal(14,4) DEFAULT '0.0000',
  `reduced_vat_base` decimal(14,4) DEFAULT '0.0000',
  `reduced_vat_amount` decimal(14,4) DEFAULT '0.0000',
  `super_reduced_vat_base` decimal(14,4) DEFAULT '0.0000',
  `super_reduced_vat_amount` decimal(14,4) DEFAULT '0.0000',
  `account_id` int(11) DEFAULT '0',
  `place_id` int(11) DEFAULT '0',
  `invoice_address_id` int(11) DEFAULT '0',
  `delivery_contact_id` int(11) DEFAULT '0',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `finance_counter`
--

CREATE TABLE `finance_counter` (
  `id` int(11) NOT NULL,
  `document_type` tinyint(4) DEFAULT '0',
  `value` int(11) DEFAULT '0',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `finance_document`
--

CREATE TABLE `finance_document` (
  `id` int(11) NOT NULL,
  `document_id` int(11) DEFAULT NULL,
  `commitment_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT '',
  `count` int(11) DEFAULT '0',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `finance_document`
--

INSERT INTO `finance_document` (`id`, `document_id`, `commitment_id`, `contact_id`, `address_id`, `type`, `count`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 7, 12, 2, 1, 'invoice', 1223, 'active', '2024-06-15 18:03:56', 83);

-- --------------------------------------------------------

--
-- Structure de la table `finance_document_invoice`
--

CREATE TABLE `finance_document_invoice` (
  `id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT '',
  `account_id` int(11) DEFAULT '0',
  `name` varchar(255) DEFAULT '',
  `mime` varchar(255) DEFAULT '',
  `version` smallint(6) DEFAULT '0',
  `visibility` varchar(8) DEFAULT 'active',
  `content_vector` mediumtext,
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `finance_document_invoice`
--

INSERT INTO `finance_document_invoice` (`id`, `type`, `account_id`, `name`, `mime`, `version`, `visibility`, `content_vector`, `touched_at`, `touched_by`) VALUES
(7, 'text', 1, 'facture-client1-2024-07-07', 'application/json', 1, 'active', '52,53,54,55', '2024-07-07 22:05:23', 83),
(9, 'text', 1, 'facture-client1-2024-07-07', 'application/json', 2, 'active', '52,53,57,55', '2024-07-07 22:13:35', 83),
(10, 'text', 2, 'facture-client1-2024-07-07', 'application/json', 1, 'active', '58,59,60,61', '2024-07-07 22:16:12', 83),
(12, 'text', 2, 'facture-client1-2024-07-07', 'application/json', 2, 'active', '58,59,63,61', '2024-07-07 22:17:58', 83);

-- --------------------------------------------------------

--
-- Structure de la table `finance_revenue`
--

CREATE TABLE `finance_revenue` (
  `id` int(11) NOT NULL,
  `commitment_id` int(11) DEFAULT '0',
  `catalogue_id` int(11) DEFAULT '0',
  `caption` varchar(255) DEFAULT '',
  `description` mediumtext,
  `unit_price` varchar(255) DEFAULT '',
  `quantity` varchar(255) DEFAULT '',
  `amount` varchar(255) DEFAULT '',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `finance_term`
--

CREATE TABLE `finance_term` (
  `id` int(11) NOT NULL,
  `commitment_id` int(11) DEFAULT '0',
  `status` varchar(255) DEFAULT '',
  `caption` varchar(255) DEFAULT '',
  `amount` varchar(255) DEFAULT '',
  `payment_method` varchar(255) DEFAULT '',
  `payment_lettering` varchar(255) DEFAULT '',
  `due_date` date DEFAULT NULL,
  `settlement_date` date DEFAULT NULL,
  `collection_date` date DEFAULT NULL,
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `interaction`
--

CREATE TABLE `interaction` (
  `id` int(11) NOT NULL,
  `place_id` varchar(255) DEFAULT '',
  `status` varchar(255) DEFAULT '',
  `provider` varchar(255) DEFAULT '',
  `endpoint` varchar(255) DEFAULT '',
  `method` varchar(255) DEFAULT '',
  `params` mediumtext,
  `body` mediumtext,
  `authorization` varchar(255) DEFAULT NULL,
  `status_code` varchar(255) DEFAULT '',
  `response_body` mediumtext,
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `interaction`
--

INSERT INTO `interaction` (`id`, `place_id`, `status`, `provider`, `endpoint`, `method`, `params`, `body`, `authorization`, `status_code`, `response_body`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, '1', 'to_send', 'brevo', 'https://api.brevo.com', 'post', '{ \"email\": \"a.b@c.net\" }', '{ \"template_id\": 23 }', 'bearer', '200', '{ \"status\": \"ok\" }', 'active', '2024-07-08 13:37:28', 83),
(2, '', 'new', 'www', '/', 'POST', '\"{\"recaptcha\":{\"error\":{\"code\":400,\"message\":\"At least one of the following Assessment fields is required: event.token, private_password_leak_verification, event.express, event.firewall_policy_evaluation, event.transaction_data (see documentation for required transaction_data fields).\",\"status\":\"INVALID_ARGUMENT\"}}}\"', NULL, NULL, '', NULL, 'active', '2026-05-05 19:35:56', 83);

-- --------------------------------------------------------

--
-- Structure de la table `interest`
--

CREATE TABLE `interest` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT '',
  `vector` varchar(255) DEFAULT '',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `learning_audit`
--

CREATE TABLE `learning_audit` (
  `id` int(11) NOT NULL,
  `entity` varchar(255) DEFAULT '',
  `row_id` int(11) DEFAULT '0',
  `property` varchar(255) DEFAULT '',
  `value` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_audit`
--

INSERT INTO `learning_audit` (`id`, `entity`, `row_id`, `property`, `value`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'learning_report', 1, 'group_id', '1', 'active', '2024-07-10 09:46:20', 83),
(2, 'learning_report', 1, 'subject_id', '1', 'active', '2024-07-10 09:46:20', 83),
(3, 'learning_report', 1, 'trainer_id', '1', 'active', '2024-07-10 09:46:20', 83),
(4, 'learning_report', 1, 'date', '2024-07-01', 'active', '2024-07-10 09:46:20', 83),
(5, 'learning_report', 1, 'rate', '2', 'active', '2024-07-10 09:46:20', 83),
(6, 'learning_report', 2, 'group_id', '2', 'active', '2024-07-10 09:46:20', 83),
(7, 'learning_report', 2, 'subject_id', '2', 'active', '2024-07-10 09:46:20', 83),
(8, 'learning_report', 2, 'trainer_id', '2', 'active', '2024-07-10 09:46:20', 83),
(9, 'learning_report', 2, 'date', '2024-07-02', 'active', '2024-07-10 09:46:20', 83),
(10, 'learning_report', 2, 'rate', '2', 'active', '2024-07-10 09:46:20', 83),
(11, 'learning_group', 1, 'place_id', '1', 'active', '2024-07-10 09:52:08', 83),
(12, 'learning_group', 1, 'status', 'active', 'active', '2024-07-10 09:52:08', 83),
(13, 'learning_group', 1, 'category', 'main', 'active', '2024-07-10 09:52:08', 83),
(14, 'learning_group', 1, 'name', 'AI B1 LM 1', 'active', '2024-07-10 09:52:08', 83),
(15, 'learning_group', 1, 'school', 'ai', 'active', '2024-07-10 09:52:08', 83),
(16, 'learning_group', 1, 'level', '1', 'active', '2024-07-10 09:52:08', 83),
(17, 'learning_group', 1, 'rythm', '1', 'active', '2024-07-10 09:52:08', 83),
(18, 'learning_group', 2, 'place_id', '1', 'active', '2024-07-10 09:52:08', 83),
(19, 'learning_group', 2, 'status', 'active', 'active', '2024-07-10 09:52:08', 83),
(20, 'learning_group', 2, 'category', 'main', 'active', '2024-07-10 09:52:08', 83),
(21, 'learning_group', 2, 'name', 'AI B1 JV 1', 'active', '2024-07-10 09:52:08', 83),
(22, 'learning_group', 2, 'school', 'ai', 'active', '2024-07-10 09:52:08', 83),
(23, 'learning_group', 2, 'level', '1', 'active', '2024-07-10 09:52:08', 83),
(24, 'learning_group', 2, 'rythm', '1', 'active', '2024-07-10 09:52:08', 83),
(25, 'learning_subject', 1, 'category', 'common', 'active', '2024-07-10 10:02:58', 83),
(26, 'learning_subject', 1, 'module', 'Anglais', 'active', '2024-07-10 10:02:58', 83),
(27, 'learning_subject', 1, 'school', 'ai', 'active', '2024-07-10 10:02:58', 83),
(28, 'learning_subject', 1, 'level', '1', 'active', '2024-07-10 10:02:58', 83),
(29, 'learning_subject', 1, 'rythm', '1', 'active', '2024-07-10 10:02:58', 83),
(30, 'learning_subject', 1, 'full_time_credits', '2', 'active', '2024-07-10 10:02:58', 83),
(31, 'learning_subject', 1, 'part_time_credits', '3', 'active', '2024-07-10 10:02:58', 83),
(32, 'learning_subject', 2, 'status', 'common', 'active', '2024-07-10 10:02:58', 83),
(33, 'learning_subject', 2, 'category', 'common', 'active', '2024-07-10 10:02:58', 83),
(34, 'learning_subject', 2, 'module', 'Mathématiques', 'active', '2024-07-10 10:02:58', 83),
(35, 'learning_subject', 2, 'name', 'Algèbre', 'active', '2024-07-10 10:02:58', 83),
(36, 'learning_subject', 2, 'school', 'ai', 'active', '2024-07-10 10:02:58', 83),
(37, 'learning_subject', 2, 'level', '1', 'active', '2024-07-10 10:02:58', 83),
(38, 'learning_subject', 2, 'rythm', '1', 'active', '2024-07-10 10:02:58', 83),
(39, 'learning_subject', 2, 'full_time_credits', '2', 'active', '2024-07-10 10:02:58', 83),
(40, 'learning_subject', 2, 'part_time_credits', '3', 'active', '2024-07-10 10:02:58', 83),
(41, 'learning_trainer', 1, 'contact_id', '2', 'active', '2024-07-10 10:09:48', 83),
(42, 'learning_trainer', 2, 'contact_id', '3', 'active', '2024-07-10 10:09:48', 83),
(43, 'learning_evaluation', 1, 'group_id', '1', 'active', '2024-07-10 11:01:09', 83),
(44, 'learning_evaluation', 1, 'subject_id', '1', 'active', '2024-07-10 11:01:09', 83),
(45, 'learning_evaluation', 1, 'trainer_id', '1', 'active', '2024-07-10 11:01:09', 83),
(46, 'learning_evaluation', 1, 'date', '2024-07-01', 'active', '2024-07-10 11:01:09', 83),
(47, 'learning_evaluation', 1, 'reference', '4', 'active', '2024-07-10 11:01:09', 83),
(48, 'learning_evaluation', 1, 'rate', '2', 'active', '2024-07-10 11:01:09', 83),
(49, 'learning_evaluation', 1, 'caption', 'CC 1', 'active', '2024-07-10 11:01:09', 83),
(50, 'learning_evaluation', 1, 'category', 'continuous_assessment', 'active', '2024-07-10 11:01:09', 83),
(51, 'learning_evaluation', 2, 'group_id', '2', 'active', '2024-07-10 11:01:09', 83),
(52, 'learning_evaluation', 2, 'subject_id', '2', 'active', '2024-07-10 11:01:09', 83),
(53, 'learning_evaluation', 2, 'trainer_id', '2', 'active', '2024-07-10 11:01:09', 83),
(54, 'learning_evaluation', 2, 'date', '2024-07-02', 'active', '2024-07-10 11:01:09', 83),
(55, 'learning_evaluation', 2, 'reference', '4', 'active', '2024-07-10 11:01:09', 83),
(56, 'learning_evaluation', 2, 'rate', '2', 'active', '2024-07-10 11:01:09', 83),
(57, 'learning_evaluation', 2, 'caption', 'DS 1', 'active', '2024-07-10 11:01:09', 83),
(58, 'learning_evaluation', 2, 'category', 'case_study', 'active', '2024-07-10 11:01:09', 83),
(59, 'learning_note', 1, 'status', 'new', 'active', '2024-07-10 11:22:26', 83),
(60, 'learning_note', 1, 'value', '3', 'active', '2024-07-10 11:22:26', 83),
(61, 'learning_note', 1, 'comment', 'OK', 'active', '2024-07-10 11:22:26', 83),
(62, 'learning_note', 2, 'status', 'new', 'active', '2024-07-10 11:22:26', 83),
(63, 'learning_note', 2, 'value', '3', 'active', '2024-07-10 11:22:26', 83),
(64, 'learning_note', 2, 'comment', 'OK', 'active', '2024-07-10 11:22:26', 83),
(65, 'learning_learner', 1, 'contact_id', '1', 'active', '2024-07-10 11:28:18', 83),
(66, 'learning_average', 1, 'value', '2.33', 'active', '2024-07-10 16:53:33', 83),
(67, 'learning_average', 1, 'credits', '3', 'active', '2024-07-10 16:53:33', 83),
(68, 'learning_average', 1, 'acquisition', 'not_evaluated', 'active', '2024-07-10 16:53:33', 83),
(69, 'learning_average', 2, 'value', '1', 'active', '2024-07-10 16:53:33', 83),
(70, 'learning_average', 2, 'credits', '3', 'active', '2024-07-10 16:53:33', 83),
(71, 'learning_average', 2, 'acquisition', 'recovering', 'active', '2024-07-10 16:53:33', 83);

-- --------------------------------------------------------

--
-- Structure de la table `learning_average`
--

CREATE TABLE `learning_average` (
  `id` int(11) NOT NULL,
  `learner_id` int(11) DEFAULT '0',
  `module_id` int(11) DEFAULT '0',
  `year` varchar(9) DEFAULT '',
  `period` tinyint(4) DEFAULT '0',
  `value` decimal(14,4) DEFAULT NULL,
  `proof` mediumtext,
  `reference` decimal(14,4) DEFAULT NULL,
  `factor` decimal(14,4) DEFAULT NULL,
  `acquisition` varchar(255) DEFAULT '',
  `comment` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_average`
--

INSERT INTO `learning_average` (`id`, `learner_id`, `module_id`, `year`, `period`, `value`, `proof`, `reference`, `factor`, `acquisition`, `comment`, `visibility`, `touched_at`, `touched_by`) VALUES
(9, 1, 13, '2024-25', 1, '2.5200', '[{\"note_id\":1,\"subject_id\":1,\"value\":\"3.0000\",\"reference\":\"4.0000\",\"rate\":\"2.0000\"},{\"note_id\":3,\"subject_id\":1,\"value\":\"2.0000\",\"reference\":\"4.0000\",\"rate\":\"2.0000\"}]', NULL, '2.0000', 'recovering', 'Partiel passé le xx/xx/xxxx', 'active', '2024-07-22 19:16:16', 83),
(10, 3, 13, '2024-25', 1, NULL, NULL, NULL, '2.0000', '', 'Partiel passé le xx/xx/xxxx', 'active', '2024-07-20 16:49:23', 83),
(11, 1, 14, '2024-25', 1, NULL, NULL, NULL, '0.0000', '', '', 'active', '2024-07-20 13:30:05', 83),
(21, 2, 13, '2024-25', 1, '3.1200', '[{\"note_id\":2,\"subject_id\":1,\"value\":\"3.1000\",\"reference\":\"4.0000\",\"rate\":\"2.0000\"}]', NULL, '2.0000', 'recovering', 'Partiel passé le xx/xx/xxxx', 'active', '2024-07-22 21:20:53', 83);

-- --------------------------------------------------------

--
-- Structure de la table `learning_document`
--

CREATE TABLE `learning_document` (
  `id` int(11) NOT NULL,
  `document_id` int(11) DEFAULT NULL,
  `learner_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `learning_evaluation`
--

CREATE TABLE `learning_evaluation` (
  `id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT '0',
  `subject_id` int(11) DEFAULT '0',
  `trainer_id` int(11) DEFAULT '0',
  `year` varchar(9) DEFAULT '',
  `period` tinyint(4) DEFAULT '0',
  `date` date DEFAULT NULL,
  `reference` decimal(14,4) DEFAULT '0.0000',
  `rate` decimal(14,4) DEFAULT '0.0000',
  `caption` varchar(255) DEFAULT '',
  `category` varchar(255) DEFAULT NULL,
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_evaluation`
--

INSERT INTO `learning_evaluation` (`id`, `group_id`, `subject_id`, `trainer_id`, `year`, `period`, `date`, `reference`, `rate`, `caption`, `category`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 1, 1, 1, '2024-25', 1, '2024-07-01', '4.0000', '2.0000', 'CC 1', 'continuous_assessment', 'active', '2024-07-10 11:01:09', 83),
(2, 2, 2, 2, '2024-25', 1, '2024-07-02', '4.0000', '2.0000', 'DS 1', 'case_study', 'active', '2024-07-10 11:01:09', 83);

-- --------------------------------------------------------

--
-- Structure de la table `learning_group`
--

CREATE TABLE `learning_group` (
  `id` int(11) NOT NULL,
  `place_id` varchar(255) DEFAULT '',
  `category` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `school` varchar(255) DEFAULT '',
  `level` varchar(255) DEFAULT '',
  `rythm` tinyint(4) DEFAULT '0',
  `schedule_ids` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_group`
--

INSERT INTO `learning_group` (`id`, `place_id`, `category`, `name`, `school`, `level`, `rythm`, `schedule_ids`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, '1', 'main', 'AI B1 LM 1', 'ai', '1', 1, '', 'active', '2024-07-10 09:52:08', 83),
(2, '1', 'main', 'AI B1 JV 1', 'ai', '1', 1, '', 'active', '2024-07-10 09:52:08', 83);

-- --------------------------------------------------------

--
-- Structure de la table `learning_group_subject`
--

CREATE TABLE `learning_group_subject` (
  `id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT '0',
  `module_subject_id` int(11) DEFAULT '0',
  `trainer_id` int(11) DEFAULT '0',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `learning_learner`
--

CREATE TABLE `learning_learner` (
  `id` int(11) NOT NULL,
  `place_id` int(11) DEFAULT '0',
  `contact_id` int(11) DEFAULT '0',
  `legal_contact_id` int(11) DEFAULT '0',
  `status` varchar(255) DEFAULT '',
  `registration_date` varchar(255) DEFAULT '',
  `school` varchar(255) DEFAULT '',
  `level` varchar(255) DEFAULT '',
  `year` varchar(255) DEFAULT '',
  `school_email` varchar(255) DEFAULT '',
  `rythm` tinyint(4) DEFAULT '0',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_learner`
--

INSERT INTO `learning_learner` (`id`, `place_id`, `contact_id`, `legal_contact_id`, `status`, `registration_date`, `school`, `level`, `year`, `school_email`, `rythm`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 1, 1, 0, 'registered', '2024-06-01', 'ai', '1', '2024-25', 'bruno.test.appr@ecole.com', 1, 'active', '2024-07-10 11:28:18', 83),
(2, 1, 1, 0, 'registered', '2024-06-01', 'ai', '1', '2025-26', 'bruno.test.appr@ecole.com', 1, 'active', '2024-07-10 11:28:18', 83),
(3, 1, 2, 0, 'registered', '2024-06-01', 'ai', '1', '2024-25', 'francoise.test.appr@ecole.com', 1, 'active', '2024-07-10 11:28:18', 83);

-- --------------------------------------------------------

--
-- Structure de la table `learning_module`
--

CREATE TABLE `learning_module` (
  `id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT '0',
  `trainer_id` int(11) DEFAULT '0',
  `year` varchar(9) DEFAULT '',
  `period` tinyint(4) DEFAULT '0',
  `name` varchar(255) DEFAULT '',
  `reference` decimal(14,4) DEFAULT '0.0000',
  `factor` decimal(14,4) DEFAULT '0.0000',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_module`
--

INSERT INTO `learning_module` (`id`, `group_id`, `trainer_id`, `year`, `period`, `name`, `reference`, `factor`, `visibility`, `touched_at`, `touched_by`) VALUES
(9, 1, 1, '2023-2024', 1, '', '4.0000', '1.0000', 'active', '2024-07-18 21:57:16', 83),
(10, 2, 2, '2023-2024', 1, '', '4.0000', '1.0000', 'active', '2024-07-18 21:57:16', 83),
(13, 1, 1, '2023-2024', 1, 'Mathématiques', '4.0000', '0.7000', 'active', '2024-07-20 18:48:00', 83),
(14, 2, 0, '2023-2024', 1, 'Numérique', '4.0000', '1.0000', 'active', '2024-07-19 19:28:21', 83);

-- --------------------------------------------------------

--
-- Structure de la table `learning_note`
--

CREATE TABLE `learning_note` (
  `id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT '',
  `learner_id` int(11) DEFAULT '0',
  `evaluation_id` int(11) DEFAULT '0',
  `value` decimal(14,4) DEFAULT NULL,
  `comment` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_note`
--

INSERT INTO `learning_note` (`id`, `status`, `learner_id`, `evaluation_id`, `value`, `comment`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'new', 1, 1, '3.0000', 'OK', 'active', '2024-07-10 11:22:26', 83),
(2, 'new', 3, 1, '3.1000', 'OK', 'active', '2024-07-10 11:22:26', 83),
(3, 'new', 1, 2, '2.0000', 'Correct', 'active', '2024-07-10 11:22:26', 83);

-- --------------------------------------------------------

--
-- Structure de la table `learning_schedule`
--

CREATE TABLE `learning_schedule` (
  `id` int(11) NOT NULL,
  `place_id` int(11) DEFAULT '0',
  `subject_id` int(11) DEFAULT '0',
  `trainer_id` int(11) DEFAULT '0',
  `status` varchar(255) DEFAULT '',
  `school` varchar(255) DEFAULT '',
  `level` varchar(255) DEFAULT '',
  `year` varchar(255) DEFAULT '',
  `rythm` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `description` mediumtext,
  `day_of_week` tinyint(4) DEFAULT '0',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `duration` int(11) DEFAULT '0',
  `location` varchar(255) DEFAULT '',
  `connection_link` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_schedule`
--

INSERT INTO `learning_schedule` (`id`, `place_id`, `subject_id`, `trainer_id`, `status`, `school`, `level`, `year`, `rythm`, `name`, `description`, `day_of_week`, `start_date`, `end_date`, `start_time`, `end_time`, `duration`, `location`, `connection_link`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 1, 1, 1, 'draft', 'ai', '', '2024-25', '', 'AI B1 LM1 - Anglais', '', 1, '2024-09-04', NULL, '09:00:30', '11:00:00', 0, '', '', 'active', '2024-09-03 23:42:05', 0),
(2, 1, 1, 1, 'draft', 'ai', '', '2024-25', '', 'AI B1 LM1 - Anglais', '', 1, '2024-09-11', NULL, '09:00:30', '11:00:00', 0, '', '', 'active', '2024-09-03 23:42:05', 0),
(3, 1, 1, 1, 'draft', 'ai', '', '2024-25', '', 'AI B1 LM1 - Algèbre', '', 1, '2024-09-06', NULL, '11:00:00', '13:30:00', 0, '', '', 'active', '2024-09-03 23:42:05', 0);

-- --------------------------------------------------------

--
-- Structure de la table `learning_subject`
--

CREATE TABLE `learning_subject` (
  `id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT '',
  `category` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `description` mediumtext,
  `school` varchar(255) DEFAULT '',
  `level` varchar(255) DEFAULT '',
  `rythm` tinyint(4) DEFAULT '0',
  `full_time_credits` tinyint(4) DEFAULT NULL,
  `part_time_credits` tinyint(4) DEFAULT NULL,
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_subject`
--

INSERT INTO `learning_subject` (`id`, `status`, `category`, `name`, `description`, `school`, `level`, `rythm`, `full_time_credits`, `part_time_credits`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'active', 'common', 'Anglais', '', 'ai', '1', 1, 2, 3, 'active', '2024-07-10 10:02:58', 83),
(2, 'common', 'common', 'Algèbre', '', 'ai', '1', 1, 2, 3, 'active', '2024-07-10 10:02:58', 83);

-- --------------------------------------------------------

--
-- Structure de la table `learning_trainer`
--

CREATE TABLE `learning_trainer` (
  `id` int(11) NOT NULL,
  `contact_id` int(11) DEFAULT '0',
  `status` varchar(255) DEFAULT '',
  `school` varchar(255) DEFAULT '',
  `school_email` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_trainer`
--

INSERT INTO `learning_trainer` (`id`, `contact_id`, `status`, `school`, `school_email`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 2, 'active', 'ai', 'a2.b2.int@ecole.com', 'active', '2024-07-10 10:09:48', 83),
(2, 3, 'active', 'ai', 'test2.test2.int@ecole.com', 'active', '2024-07-10 10:09:48', 83);

-- --------------------------------------------------------

--
-- Structure de la table `learning_trainer_commitment`
--

CREATE TABLE `learning_trainer_commitment` (
  `id` int(11) NOT NULL,
  `trainer_id` int(11) DEFAULT '0',
  `status` varchar(255) DEFAULT '',
  `year` varchar(255) DEFAULT '',
  `hourly_rate` varchar(255) DEFAULT '',
  `commitment_date` date DEFAULT NULL,
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `learning_trainer_commitment`
--

INSERT INTO `learning_trainer_commitment` (`id`, `trainer_id`, `status`, `year`, `hourly_rate`, `commitment_date`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 1, 'contract_sent', '2024-2025', '60', '2024-09-04', 'active', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `mkt_automation_template`
--

CREATE TABLE `mkt_automation_template` (
  `id` int(11) NOT NULL,
  `folder` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `email_subject` varchar(255) DEFAULT '',
  `email_body` mediumtext,
  `cc` varchar(255) DEFAULT '',
  `cci` varchar(255) DEFAULT '',
  `sms` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `mkt_automation_template`
--

INSERT INTO `mkt_automation_template` (`id`, `folder`, `name`, `email_subject`, `email_body`, `cc`, `cci`, `sms`, `visibility`, `touched_at`, `touched_by`) VALUES
(21, 'automation/template', 'nouveau-flower', 'Inscription au concours Flow-ER Learning', '<p>{n_first}, donnez un sens à vos études en vous inscrivant au concours Flow-ER Learning. Cliquez ici https://flow-er.fr/lrn/cb/{hash}</p>', '', '', 'Donnez un sens à vos études en vous inscrivant au concours Flow-ER Learning: flow-er.fr/lrn/cb/{hash}', 'active', '2024-07-10 19:15:02', 83),
(22, 'automation/template', 'a_relancer-flower', 'Inscription au concours Flow-ER Learning', '<p>{n_first}, N’oubliez pas de vous inscrire au concours Flow-ER Learning. Cliquez ici https://flow-er.fr/lrn/cb/{hash}</p>', '', '', 'N’oubliez pas de vous inscrire au concours Flow-ER Learning: flow-er.fr/lrn/cb/{hash}', 'active', '2024-07-10 19:15:02', 83);

-- --------------------------------------------------------

--
-- Structure de la table `mkt_targeted`
--

CREATE TABLE `mkt_targeted` (
  `id` int(11) NOT NULL,
  `year` varchar(4) DEFAULT '',
  `month` varchar(7) DEFAULT '',
  `candidat_id` int(11) DEFAULT '0',
  `template_id` int(11) DEFAULT '0',
  `status` varchar(255) DEFAULT '',
  `target` varchar(255) DEFAULT '',
  `sent_at` datetime DEFAULT NULL,
  `email_subject` varchar(255) DEFAULT '',
  `email_body` mediumtext,
  `cc` varchar(255) DEFAULT '',
  `cci` varchar(255) DEFAULT '',
  `sms` varchar(255) DEFAULT '',
  `visibility` varchar(8) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `mkt_targeted`
--

INSERT INTO `mkt_targeted` (`id`, `year`, `month`, `candidat_id`, `template_id`, `status`, `target`, `sent_at`, `email_subject`, `email_body`, `cc`, `cci`, `sms`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, '2024', '2024-09', 1, 0, 'sent', 'nouveau-flower-2024-09-01', '2024-09-02 21:00:00', 'Inscription au concours Flow-ER Learning', '<p>Tamino,</p>\r\n<p>Donne un sens à tes études en t’inscrivant au concours Flow-ER Learning.</p>\r\n<p class=\"text-center\"><a role=\"Button\" class=\"btn btn-primary\" href=\"https://flow-er.fr/lrn/cb/1\">Prendre un rendez-vous d’admission</a></p>\r\n<p><img src=\"/flow-er/logos/flow-er-3.png\" width=\"40\" class=\"img-fluid\"></p>', '', '', 'Donnez un sens à vos études en vous inscrivant au concours Flow-ER Learning. Cliquez ici https://flow-er.fr/lrn/cb/1', 'active', '2024-09-02 21:08:46', 0),
(2, '2024', '2024-09', 2, 0, 'sent', 'nouveau-flower-2024-09-01', '2024-09-02 21:00:00', 'Inscription au concours Flow-ER Learning', '<p>Tamino,</p>\r\n<p>Donne un sens à tes études en t’inscrivant au concours Flow-ER Learning.</p>\r\n<p class=\"text-center\"><a role=\"Button\" class=\"btn btn-primary\" href=\"https://flow-er.fr/lrn/cb/1\">Prendre un rendez-vous d’admission</a></p>\r\n<p><img src=\"/flow-er/logos/flow-er-3.png\" width=\"40\" class=\"img-fluid\"></p>', '', '', 'Donnez un sens à vos études en vous inscrivant au concours Flow-ER Learning. Cliquez ici https://flow-er.fr/lrn/cb/1', 'active', '2024-09-02 21:08:46', 0),
(3, '2024', '2024-09', 3, 0, 'sent', 'nouveau-flower-2024-09-01', '2024-09-02 21:00:00', 'Inscription au concours Flow-ER Learning', '<p>Tamino,</p>\r\n<p>Donne un sens à tes études en t’inscrivant au concours Flow-ER Learning.</p>\r\n<p class=\"text-center\"><a role=\"Button\" class=\"btn btn-primary\" href=\"https://flow-er.fr/lrn/cb/1\">Prendre un rendez-vous d’admission</a></p>\r\n<p><img src=\"/flow-er/logos/flow-er-3.png\" width=\"40\" class=\"img-fluid\"></p>', '', '', 'Donnez un sens à vos études en vous inscrivant au concours Flow-ER Learning. Cliquez ici https://flow-er.fr/lrn/cb/1', 'active', '2024-09-02 21:08:46', 0),
(4, '2024', '2024-09', 4, 0, 'sent', 'nouveau-flower-2024-09-01', '2024-09-02 21:00:00', 'Inscription au concours Flow-ER Learning', '<p>Tamino,</p>\r\n<p>Donne un sens à tes études en t’inscrivant au concours Flow-ER Learning.</p>\r\n<p class=\"text-center\"><a role=\"Button\" class=\"btn btn-primary\" href=\"https://flow-er.fr/lrn/cb/1\">Prendre un rendez-vous d’admission</a></p>\r\n<p><img src=\"/flow-er/logos/flow-er-3.png\" width=\"40\" class=\"img-fluid\"></p>', '', '', 'Donnez un sens à vos études en vous inscrivant au concours Flow-ER Learning. Cliquez ici https://flow-er.fr/lrn/cb/1', 'active', '2024-09-02 21:08:46', 0),
(5, '2024', '2024-09', 5, 0, 'sent', 'nouveau-flower-2024-09-01', '2024-09-02 21:00:00', 'Inscription au concours Flow-ER Learning', '<p>Tamino,</p>\r\n<p>Donne un sens à tes études en t’inscrivant au concours Flow-ER Learning.</p>\r\n<p class=\"text-center\"><a role=\"Button\" class=\"btn btn-primary\" href=\"https://flow-er.fr/lrn/cb/1\">Prendre un rendez-vous d’admission</a></p>\r\n<p><img src=\"/flow-er/logos/flow-er-3.png\" width=\"40\" class=\"img-fluid\"></p>', '', '', 'Donnez un sens à vos études en vous inscrivant au concours Flow-ER Learning. Cliquez ici https://flow-er.fr/lrn/cb/1', 'active', '2024-09-02 21:08:46', 0);

-- --------------------------------------------------------

--
-- Structure de la table `place`
--

CREATE TABLE `place` (
  `id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `region` varchar(255) DEFAULT '',
  `logo` varchar(255) DEFAULT '',
  `adr_street` varchar(255) DEFAULT '',
  `adr_extended` varchar(255) DEFAULT '',
  `adr_post_office_box` varchar(255) DEFAULT '',
  `adr_zip` varchar(255) DEFAULT '',
  `adr_city` varchar(255) DEFAULT '',
  `adr_state` varchar(255) DEFAULT '',
  `adr_country` varchar(255) DEFAULT '',
  `bank_name` varchar(255) DEFAULT '',
  `bank_account` varchar(255) DEFAULT '',
  `bank_identifier` varchar(255) DEFAULT '',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `n_first` varchar(255) DEFAULT '',
  `n_last` varchar(255) DEFAULT '',
  `n_fn` varchar(255) DEFAULT '',
  `email` varchar(255) DEFAULT '',
  `email_key` varchar(255) DEFAULT '',
  `place_id` int(11) DEFAULT '0',
  `role` varchar(255) DEFAULT '',
  `theme` varchar(255) NOT NULL DEFAULT '',
  `notifications` varchar(255) DEFAULT '',
  `user_id` int(11) DEFAULT '0',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `profile`
--

INSERT INTO `profile` (`id`, `n_first`, `n_last`, `n_fn`, `email`, `email_key`, `place_id`, `role`, `theme`, `notifications`, `user_id`, `visibility`, `touched_at`, `touched_by`) VALUES
(10, 'Démo', 'CRITE', NULL, 'bruno@lartillot.net', '', NULL, 'responsible', 'light', 'email', 3, 'active', '2026-06-16 16:02:45', 1),
(11, 'Test', 'TEST3107', '', 'test3107@test.com', '', 1, 'responsible', '', '', 0, 'active', '2025-07-31 12:11:25', 1);

-- --------------------------------------------------------

--
-- Structure de la table `tag`
--

CREATE TABLE `tag` (
  `id` int(11) NOT NULL,
  `entity` varchar(255) DEFAULT '',
  `row_id` int(11) DEFAULT '0',
  `name` varchar(255) DEFAULT '',
  `visibility` varchar(255) DEFAULT '',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `tag`
--

INSERT INTO `tag` (`id`, `entity`, `row_id`, `name`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'account', 2, 'IA', 'active', '2026-06-09 15:25:48', 1),
(2, 'account', 2, 'edu', 'active', '2026-06-09 15:25:48', 1),
(3, 'account', 8, 'edu', 'active', '2026-06-09 15:25:48', 1);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT '',
  `n_fn` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) DEFAULT '',
  `locale` varchar(255) DEFAULT '',
  `password` varchar(255) DEFAULT '',
  `last_login` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `login_failed` int(11) DEFAULT '0',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `status`, `n_fn`, `email`, `locale`, `password`, `last_login`, `last_updated`, `login_failed`, `touched_at`, `touched_by`) VALUES
(3, 'pending', 'Bruno', 'bruno@p-pit.fr', '', '$2b$10$NNPyWaS1R47m/4EVUQv.f.LGGmFC1uEYOI.VDrSwo3qybx4lYcq3S', '2026-05-17 19:20:21', '2024-11-29 22:14:35', 0, '2026-05-17 21:20:21', 3),
(4, 'pending', 'Support Tech', 'support@p-pit.fr', '', NULL, '2024-03-24 23:24:43', '2024-03-24 23:24:32', 0, '2024-03-24 22:48:11', 83);

-- --------------------------------------------------------

--
-- Structure de la table `vcard`
--

CREATE TABLE `vcard` (
  `id` int(11) NOT NULL,
  `n_title` varchar(255) DEFAULT '',
  `n_first` varchar(255) DEFAULT '',
  `n_last` varchar(255) DEFAULT '',
  `n_birth` varchar(255) DEFAULT '',
  `tel_work` varchar(255) DEFAULT '',
  `tel_cell` varchar(255) DEFAULT '',
  `email` varchar(255) DEFAULT '',
  `email_validity` tinyint(4) DEFAULT '0',
  `adr_street` varchar(255) DEFAULT '',
  `adr_extended` varchar(255) DEFAULT '',
  `adr_post_office_box` varchar(255) DEFAULT '',
  `adr_zip` varchar(255) DEFAULT '',
  `adr_city` varchar(255) DEFAULT '',
  `adr_state` varchar(255) DEFAULT '',
  `adr_country` varchar(255) DEFAULT '',
  `gender` char(1) DEFAULT '',
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(255) DEFAULT '',
  `nationality` varchar(255) DEFAULT '',
  `profession` varchar(255) DEFAULT '',
  `opt_in_out` tinyint(4) DEFAULT '0',
  `visibility` varchar(255) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `vcard`
--

INSERT INTO `vcard` (`id`, `n_title`, `n_first`, `n_last`, `n_birth`, `tel_work`, `tel_cell`, `email`, `email_validity`, `adr_street`, `adr_extended`, `adr_post_office_box`, `adr_zip`, `adr_city`, `adr_state`, `adr_country`, `gender`, `birth_date`, `birth_place`, `nationality`, `profession`, `opt_in_out`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'M', 'Bruno', 'TAMINO', '', '0111111111', '0666666666', 'a.b@test.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', 0, 'active', '2024-02-19 08:33:08', NULL),
(2, 'M', 'Françoise', 'PAMINA', '', '0222222222', '0677777777', 'a2.b2@test.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', 0, 'active', '2024-02-19 08:33:08', NULL),
(3, 'M', 'Test2', 'TEST2', '', NULL, '0688888888', 'test2.test2@test.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', 0, 'active', '2024-02-19 08:33:08', NULL),
(4, 'M', 'Test3', 'TEST3', '', NULL, '0699999999', 'test3@test.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', 0, 'active', '2024-02-19 08:33:08', NULL),
(18, '', '', '', '', '', '0777777777', '', 0, '', '', '', '', '', '', '', '', NULL, '', '', '', 0, 'active', '2024-04-14 14:12:27', 83);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `audit`
--
ALTER TABLE `audit`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `candidat`
--
ALTER TABLE `candidat`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `config_property`
--
ALTER TABLE `config_property`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `document_cell`
--
ALTER TABLE `document_cell`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `entreprise`
--
ALTER TABLE `entreprise`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `finance_account`
--
ALTER TABLE `finance_account`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `finance_audit`
--
ALTER TABLE `finance_audit`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `finance_catalogue`
--
ALTER TABLE `finance_catalogue`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `finance_commitment`
--
ALTER TABLE `finance_commitment`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `finance_counter`
--
ALTER TABLE `finance_counter`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `finance_document`
--
ALTER TABLE `finance_document`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `finance_document_invoice`
--
ALTER TABLE `finance_document_invoice`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `finance_revenue`
--
ALTER TABLE `finance_revenue`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `finance_term`
--
ALTER TABLE `finance_term`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `interaction`
--
ALTER TABLE `interaction`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `interest`
--
ALTER TABLE `interest`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_audit`
--
ALTER TABLE `learning_audit`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_average`
--
ALTER TABLE `learning_average`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_document`
--
ALTER TABLE `learning_document`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_evaluation`
--
ALTER TABLE `learning_evaluation`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_group`
--
ALTER TABLE `learning_group`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_group_subject`
--
ALTER TABLE `learning_group_subject`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_learner`
--
ALTER TABLE `learning_learner`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_module`
--
ALTER TABLE `learning_module`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_note`
--
ALTER TABLE `learning_note`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_schedule`
--
ALTER TABLE `learning_schedule`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_subject`
--
ALTER TABLE `learning_subject`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_trainer`
--
ALTER TABLE `learning_trainer`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learning_trainer_commitment`
--
ALTER TABLE `learning_trainer_commitment`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `mkt_automation_template`
--
ALTER TABLE `mkt_automation_template`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `mkt_targeted`
--
ALTER TABLE `mkt_targeted`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `place`
--
ALTER TABLE `place`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `vcard`
--
ALTER TABLE `vcard`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `audit`
--
ALTER TABLE `audit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `candidat`
--
ALTER TABLE `candidat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `config_property`
--
ALTER TABLE `config_property`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `document`
--
ALTER TABLE `document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `document_cell`
--
ALTER TABLE `document_cell`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT pour la table `entreprise`
--
ALTER TABLE `entreprise`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `finance_account`
--
ALTER TABLE `finance_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `finance_audit`
--
ALTER TABLE `finance_audit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `finance_catalogue`
--
ALTER TABLE `finance_catalogue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `finance_commitment`
--
ALTER TABLE `finance_commitment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `finance_counter`
--
ALTER TABLE `finance_counter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `finance_document`
--
ALTER TABLE `finance_document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `finance_document_invoice`
--
ALTER TABLE `finance_document_invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `finance_revenue`
--
ALTER TABLE `finance_revenue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `finance_term`
--
ALTER TABLE `finance_term`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `interaction`
--
ALTER TABLE `interaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `interest`
--
ALTER TABLE `interest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `learning_audit`
--
ALTER TABLE `learning_audit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT pour la table `learning_average`
--
ALTER TABLE `learning_average`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `learning_document`
--
ALTER TABLE `learning_document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `learning_evaluation`
--
ALTER TABLE `learning_evaluation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `learning_group`
--
ALTER TABLE `learning_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `learning_group_subject`
--
ALTER TABLE `learning_group_subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `learning_learner`
--
ALTER TABLE `learning_learner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `learning_module`
--
ALTER TABLE `learning_module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `learning_note`
--
ALTER TABLE `learning_note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `learning_schedule`
--
ALTER TABLE `learning_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `learning_subject`
--
ALTER TABLE `learning_subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `learning_trainer`
--
ALTER TABLE `learning_trainer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `learning_trainer_commitment`
--
ALTER TABLE `learning_trainer_commitment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `mkt_automation_template`
--
ALTER TABLE `mkt_automation_template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `mkt_targeted`
--
ALTER TABLE `mkt_targeted`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `place`
--
ALTER TABLE `place`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `vcard`
--
ALTER TABLE `vcard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
