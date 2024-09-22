-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : lun. 29 juil. 2024 à 14:16
-- Version du serveur : 5.7.39
-- Version de PHP : 8.2.0

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
-- Structure de la table `vcard`
--

CREATE TABLE `vcard` (
  `id` int(11) NOT NULL,
  `n_title` varchar(255) DEFAULT '',
  `n_first` varchar(255) DEFAULT '',
  `n_last` varchar(255) DEFAULT '',
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
  `place_of_birth` varchar(255) DEFAULT '',
  `nationality` varchar(255) DEFAULT '',
  `visibility` varchar(255) DEFAULT 'active',
  `touched_at` datetime DEFAULT NULL,
  `touched_by` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `vcard`
--

INSERT INTO `vcard` (`id`, `n_title`, `n_first`, `n_last`, `tel_work`, `tel_cell`, `email`, `email_validity`, `adr_street`, `adr_extended`, `adr_post_office_box`, `adr_zip`, `adr_city`, `adr_state`, `adr_country`, `gender`, `birth_date`, `place_of_birth`, `nationality`, `visibility`, `touched_at`, `touched_by`) VALUES
(1, 'M', 'Bruno', 'LARTILLOT', '0111111111', '0666666666', 'a.b@test.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2024-02-19 08:33:08', NULL),
(2, 'M', 'Test', 'TEST', '0222222222', '0677777777', 'a2.b2@test.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2024-02-19 08:33:08', NULL),
(3, 'M', 'Test2', 'TEST2', NULL, '0688888888', 'test2.test2@test.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2024-02-19 08:33:08', NULL),
(4, 'M', 'Test3', 'TEST3', NULL, '0699999999', 'test3@test.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2024-02-19 08:33:08', NULL),
(18, '', '', '', '', '0777777777', '', 0, '', '', '', '', '', '', '', '', NULL, '', '', 'active', '2024-04-14 14:12:27', 83);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `vcard`
--
ALTER TABLE `vcard`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `vcard`
--
ALTER TABLE `vcard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
