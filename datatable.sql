-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2021 at 03:42 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `datatable`
--

-- --------------------------------------------------------

--
-- Table structure for table `berkas`
--

CREATE TABLE `berkas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `berkas`
--

INSERT INTO `berkas` (`id`, `nama`) VALUES
(1, 'Berkas 1'),
(2, 'Berkas 2'),
(3, 'Berkas 3'),
(4, 'Berkas 4'),
(5, 'Berkas 5'),
(6, 'Berkas 6'),
(7, 'Berkas 7'),
(8, 'Berkas 8'),
(9, 'Berkas 9'),
(10, 'Berkas 10'),
(12, 'Berkas 11');

-- --------------------------------------------------------

--
-- Table structure for table `tipe_berkas`
--

CREATE TABLE `tipe_berkas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_berkas` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tipe_berkas`
--

INSERT INTO `tipe_berkas` (`id`, `id_berkas`, `nama`) VALUES
(1, 1, 'jpg'),
(2, 1, 'png'),
(3, 2, 'pdf'),
(4, 2, 'jpg'),
(5, 2, 'png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `berkas`
--
ALTER TABLE `berkas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tipe_berkas`
--
ALTER TABLE `tipe_berkas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_berkas` (`id_berkas`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `berkas`
--
ALTER TABLE `berkas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tipe_berkas`
--
ALTER TABLE `tipe_berkas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tipe_berkas`
--
ALTER TABLE `tipe_berkas`
  ADD CONSTRAINT `tipe_berkas_ibfk_1` FOREIGN KEY (`id_berkas`) REFERENCES `berkas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
