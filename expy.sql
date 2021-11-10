-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 24, 2021 at 10:56 AM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `expy`
--

-- --------------------------------------------------------

--
-- Table structure for table `ci_sessions`
--

CREATE TABLE `ci_sessions` (
  `id` varchar(40) NOT NULL DEFAULT '0',
  `ip_address` varchar(45) NOT NULL DEFAULT '0',
  `data` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ci_sessions`
--

INSERT INTO `ci_sessions` (`id`, `ip_address`, `data`, `timestamp`) VALUES
('0pn74hvdgjiddqncu5nlelpakgm3d8pt', '127.0.0.1', '__ci_last_regenerate|i:1610266179;', '0000-00-00 00:00:00'),
('0t5qgjikriuokf2872rv4gr81ojif3bq', '127.0.0.1', '__ci_last_regenerate|i:1610264969;', '0000-00-00 00:00:00'),
('13aqsrs7uvm9c72969luh6ibtkb7iu9v', '::1', '__ci_last_regenerate|i:1610618820;', '0000-00-00 00:00:00'),
('1m1cqtuvi628j2ml06ndj14mf2u9nvmt', '::1', '__ci_last_regenerate|i:1610618099;', '0000-00-00 00:00:00'),
('1nbsvmgv6guogd2m3bmkn25q1o4hn97e', '::1', '__ci_last_regenerate|i:1610435446;', '0000-00-00 00:00:00'),
('1td1lsvc6dimitqagsft2901mntipboq', '::1', '__ci_last_regenerate|i:1610622970;', '0000-00-00 00:00:00'),
('26s5o9oulrb61fni3qleual3h41vqtuc', '127.0.0.1', '__ci_last_regenerate|i:1610264585;', '0000-00-00 00:00:00'),
('2lbq6pmkeal8opm5cun7jhs62753is9d', '::1', '__ci_last_regenerate|i:1610618585;', '0000-00-00 00:00:00'),
('2n8r71vss21ga286scq4ivg3uqhatdfl', '::1', '__ci_last_regenerate|i:1610618478;', '0000-00-00 00:00:00'),
('2pn9d63v63l0merad0cq5qck8fmhut09', '::1', '__ci_last_regenerate|i:1610618502;', '0000-00-00 00:00:00'),
('3600b4jt64h085p8mtglk4s9atfrefha', '127.0.0.1', '__ci_last_regenerate|i:1610266035;', '0000-00-00 00:00:00'),
('3ejbctu96mhdki0q4ep2eg1babdp0ggk', '127.0.0.1', '__ci_last_regenerate|i:1610266298;', '0000-00-00 00:00:00'),
('46m9f6dnsjhsk24q78jh3f14t8jj6vlk', '::1', '__ci_last_regenerate|i:1610618409;', '0000-00-00 00:00:00'),
('48645pu32ljc8c3it4n433lir4i252ro', '::1', '__ci_last_regenerate|i:1610618086;', '0000-00-00 00:00:00'),
('49et293sgnudtfukgb0hg5r5tr7uhft7', '127.0.0.1', '__ci_last_regenerate|i:1610266336;', '0000-00-00 00:00:00'),
('4mmdbf92funtnopamlrkmaf7as4coid1', '::1', '__ci_last_regenerate|i:1610618477;', '0000-00-00 00:00:00'),
('4st49t3m6vfgg6cih38omltk9oqvsark', '::1', '__ci_last_regenerate|i:1610263573;', '0000-00-00 00:00:00'),
('530b7dtrhst6hte8c0p60qp75b36jjb4', '::1', '__ci_last_regenerate|i:1610454458;', '0000-00-00 00:00:00'),
('5562gf3vlbu6tg4e539clbdnqnsc070r', '::1', '__ci_last_regenerate|i:1610618480;', '0000-00-00 00:00:00'),
('5klqgnqjbcgvn2lcc2776919md79o4bu', '::1', '__ci_last_regenerate|i:1610618100;', '0000-00-00 00:00:00'),
('60bs9lm21o3htnshi4msr8amhvqvmugr', '::1', '__ci_last_regenerate|i:1610618826;', '0000-00-00 00:00:00'),
('63cofcua5udps80dt3mqnhigtklhf3lu', '::1', '__ci_last_regenerate|i:1610618826;', '0000-00-00 00:00:00'),
('6hpqb40hfaghmh6irce50gkmmr7nke8r', '::1', '__ci_last_regenerate|i:1610618501;', '0000-00-00 00:00:00'),
('6il4lsqeaptv6jh747e7ql84991lru96', '::1', '__ci_last_regenerate|i:1610618081;', '0000-00-00 00:00:00'),
('6u0cqqqr86s77b0op98dvqf4m0b5dapc', '::1', '__ci_last_regenerate|i:1610622970;', '0000-00-00 00:00:00'),
('74u9u3dbqsdlkj0e92vmi2qvi47fio3n', '::1', '__ci_last_regenerate|i:1610618596;', '0000-00-00 00:00:00'),
('7mu17ultoa5tcsle1tt6t1mebdqcmbtc', '::1', '__ci_last_regenerate|i:1610618510;', '0000-00-00 00:00:00'),
('834p10a6ur67j6ubus57c8t6ecl6det5', '127.0.0.1', '__ci_last_regenerate|i:1610264871;', '0000-00-00 00:00:00'),
('8bqfs7i5o0e1fbaefr6k3hh5teo8dl3t', '127.0.0.1', '__ci_last_regenerate|i:1610265333;', '0000-00-00 00:00:00'),
('8bqk34nit555bj1ac65f6ap599mrvud7', '127.0.0.1', '__ci_last_regenerate|i:1610264944;', '0000-00-00 00:00:00'),
('8lvite9rp6ctejfv0n2v8uba5kds4bqk', '::1', '__ci_last_regenerate|i:1610618478;', '0000-00-00 00:00:00'),
('8pjstp2fraebj8lh1o39nv35ijqle0es', '::1', '__ci_last_regenerate|i:1610618487;', '0000-00-00 00:00:00'),
('90jac6lip6lbs6q424ps9iqvra40do65', '::1', '__ci_last_regenerate|i:1610619795;', '0000-00-00 00:00:00'),
('9bh3hblqs5cdluj246b0sul0pbi6lncd', '::1', '__ci_last_regenerate|i:1610622975;', '0000-00-00 00:00:00'),
('9c1p4cr5q7f1n1retk9o8cd7rqblhtg5', '127.0.0.1', '__ci_last_regenerate|i:1610265480;', '0000-00-00 00:00:00'),
('9e30j54tdndjqr6m2up1653t81o3emn4', '::1', '__ci_last_regenerate|i:1610618080;', '0000-00-00 00:00:00'),
('9lku8kkkbmki3mve3n07scq4ondsc7h2', '::1', '__ci_last_regenerate|i:1610618480;', '0000-00-00 00:00:00'),
('9t0b39uh11k8clfo6nl9hh7tkmc8dnh9', '::1', '__ci_last_regenerate|i:1610453409;', '0000-00-00 00:00:00'),
('a18pia0ud72nrmm4snuiii9c1ad08j7i', '::1', '__ci_last_regenerate|i:1610452972;', '0000-00-00 00:00:00'),
('a1960mln8imo5947veaadiod2nh0re1u', '::1', '__ci_last_regenerate|i:1610618088;', '0000-00-00 00:00:00'),
('a3hj1n1dmc555ftiib5njl8gbhrciisa', '::1', '__ci_last_regenerate|i:1610618482;', '0000-00-00 00:00:00'),
('be2osnshbqgu2kqg36e0eg1lmvo32p4r', '::1', '__ci_last_regenerate|i:1610618083;', '0000-00-00 00:00:00'),
('brn01cs42ecl4k69lk1gqm4kmpj3aqgb', '::1', '__ci_last_regenerate|i:1610618818;', '0000-00-00 00:00:00'),
('bslgjij0pvtvqe02gnnhr8qgb5p9kis9', '::1', '__ci_last_regenerate|i:1610622970;', '0000-00-00 00:00:00'),
('c13p8m6athiguh7ik01895teegbimoj7', '::1', '__ci_last_regenerate|i:1610453614;', '0000-00-00 00:00:00'),
('cevc0p3umf1v36scvsfifrbd7bl1qsl5', '::1', '__ci_last_regenerate|i:1610618485;', '0000-00-00 00:00:00'),
('ck7r1k2769to8su6qnov9ilsigd7t0qb', '::1', '__ci_last_regenerate|i:1610618480;', '0000-00-00 00:00:00'),
('cqpcuj4tv79ma44u02urnf4jho7aj0vg', '::1', '__ci_last_regenerate|i:1610618477;', '0000-00-00 00:00:00'),
('ctb3asb8eov56p92469nj58vin1qstak', '127.0.0.1', '__ci_last_regenerate|i:1610433956;', '0000-00-00 00:00:00'),
('d24n5a35pjqhlmrgal7iplhcguts0f6q', '::1', '__ci_last_regenerate|i:1610453769;', '0000-00-00 00:00:00'),
('d53jdt1qhd3e3nhsabkmqqlf8dqo2mnd', '::1', '__ci_last_regenerate|i:1610619787;', '0000-00-00 00:00:00'),
('d79batnov398e2vm5dbfgpdbot8do4i6', '::1', '__ci_last_regenerate|i:1610618477;', '0000-00-00 00:00:00'),
('dir8t9h8oouaj8hd0f6806d4pe6c7fkm', '::1', '__ci_last_regenerate|i:1610618585;', '0000-00-00 00:00:00'),
('duhfckei9hn5aua1eh1pu5uu95k3f980', '127.0.0.1', '__ci_last_regenerate|i:1610265533;', '0000-00-00 00:00:00'),
('e87ic9m7cp3vtudsj647jhf4fuu0f2s7', '127.0.0.1', '__ci_last_regenerate|i:1610434164;', '0000-00-00 00:00:00'),
('eaksufsqhnkkq6f7gaihq3fb720sujuq', '::1', '__ci_last_regenerate|i:1610622970;', '0000-00-00 00:00:00'),
('f44gs03tjll2ks81b78pea4jmq9j68gm', '::1', '__ci_last_regenerate|i:1610618088;', '0000-00-00 00:00:00'),
('f62annco49pa2pca50qcj2fj20e5q239', '::1', '__ci_last_regenerate|i:1610453789;', '0000-00-00 00:00:00'),
('fjj54l47qf1pnobv05sqrhg3erbd4s82', '::1', '__ci_last_regenerate|i:1610622970;', '0000-00-00 00:00:00'),
('fkvrccdv8eqq6kcf42pakkh99pbp883n', '::1', '__ci_last_regenerate|i:1610622971;', '0000-00-00 00:00:00'),
('fm0ol3l95ls6lumblijkdjqodpoiqgra', '::1', '__ci_last_regenerate|i:1610618501;', '0000-00-00 00:00:00'),
('fnchlkj6lk6ia3amhqgg4jd3qiubrmu9', '::1', '__ci_last_regenerate|i:1610435623;', '0000-00-00 00:00:00'),
('fucju1boadr4tkgl9sllc2hmi12er8no', '::1', '__ci_last_regenerate|i:1610618758;', '0000-00-00 00:00:00'),
('fv809plbbmmo641sdt7gbeqppskpspei', '::1', '__ci_last_regenerate|i:1610618487;', '0000-00-00 00:00:00'),
('g418lfkvrb3m7f1pm20v67np1totsge4', '::1', '__ci_last_regenerate|i:1610618088;', '0000-00-00 00:00:00'),
('gb0rrm7l0f2n38psmic9abo6fepfh059', '::1', '__ci_last_regenerate|i:1610622971;', '0000-00-00 00:00:00'),
('gd2k1onpsbb63kdu9531vvuhijd3dp8n', '::1', '__ci_last_regenerate|i:1610453120;', '0000-00-00 00:00:00'),
('gdplcipa9s5ajalj6t490248l9spl4lm', '::1', '__ci_last_regenerate|i:1610264061;', '0000-00-00 00:00:00'),
('gj7fahluvlmuhfgtl0tvo50fqk35gp5n', '::1', '__ci_last_regenerate|i:1610619786;', '0000-00-00 00:00:00'),
('gjak1m146lem0rmncjncmsk1nsvpk0dn', '::1', '__ci_last_regenerate|i:1610618086;', '0000-00-00 00:00:00'),
('gkuo1b1dd4elkj65posv7fer27h898jb', '::1', '__ci_last_regenerate|i:1610618499;', '0000-00-00 00:00:00'),
('gvdhoe2saete8m4gol0doa5d04i6llpr', '::1', '__ci_last_regenerate|i:1610619794;', '0000-00-00 00:00:00'),
('h1f32hleksr48r2gbp6uoa66madjvo4p', '::1', '__ci_last_regenerate|i:1610262212;', '0000-00-00 00:00:00'),
('h4eejrca547v76dg6vlii951iai2q7vm', '::1', '__ci_last_regenerate|i:1610454140;', '0000-00-00 00:00:00'),
('h6j1aa1bj0pnqu20p3d4jseknod1c9tn', '127.0.0.1', '__ci_last_regenerate|i:1610434144;', '0000-00-00 00:00:00'),
('h6jrok2ghv4v04q73uie081nvdmc0amv', '::1', '__ci_last_regenerate|i:1610618480;', '0000-00-00 00:00:00'),
('hcb4si04k6p2pfp2f2jgri6sl7c7u0p7', '::1', '__ci_last_regenerate|i:1610618584;', '0000-00-00 00:00:00'),
('hjvmd2tndc9p1i1o45hpjeaih20ekp9o', '::1', '__ci_last_regenerate|i:1610434542;', '0000-00-00 00:00:00'),
('hk30df0n8r7j306cgnif208djlie8v9t', '::1', '__ci_last_regenerate|i:1610618594;', '0000-00-00 00:00:00'),
('hob4fagipnni789j6klp4mc2t3rrie4m', '::1', '__ci_last_regenerate|i:1610618501;', '0000-00-00 00:00:00'),
('holjgm7laihcvo8mm9iqhgr58l6loi2g', '::1', '__ci_last_regenerate|i:1610618482;', '0000-00-00 00:00:00'),
('hruv1jgbemogsrs0rp43tt9dj67m7nu1', '127.0.0.1', '__ci_last_regenerate|i:1610264210;', '0000-00-00 00:00:00'),
('i17k9qtfjiu1er6u9npo39mg2ci4h16b', '::1', '__ci_last_regenerate|i:1610263708;', '0000-00-00 00:00:00'),
('ie6g7q7mujn0geno6245cgcsspnufk82', '::1', '__ci_last_regenerate|i:1610618770;', '0000-00-00 00:00:00'),
('ii9i6che23qt51u0650f1pha8ff3mntl', '::1', '__ci_last_regenerate|i:1610264067;', '0000-00-00 00:00:00'),
('iq29unv155lfde6n2fmsimg2sp686106', '::1', '__ci_last_regenerate|i:1610618088;', '0000-00-00 00:00:00'),
('j10t60tvcqba44rvtlhnf7ubnm0tp19b', '::1', '__ci_last_regenerate|i:1610618478;', '0000-00-00 00:00:00'),
('j7apgge9pg2qiea0d6h14k5rdgccrdga', '::1', '__ci_last_regenerate|i:1610435567;', '0000-00-00 00:00:00'),
('jivkcoavq528lmcll4g1i250014oeti6', '::1', '__ci_last_regenerate|i:1610618785;', '0000-00-00 00:00:00'),
('jmeht8mk82l2olmt8dhohgg7upqbcfb8', '::1', '__ci_last_regenerate|i:1610618487;', '0000-00-00 00:00:00'),
('k4ssgv977an5qico3sl0al10064vgk8e', '::1', '__ci_last_regenerate|i:1610618100;', '0000-00-00 00:00:00'),
('k5tqo3hoc34ogharoncpr0hv1qq63gfh', '::1', '__ci_last_regenerate|i:1610453424;', '0000-00-00 00:00:00'),
('k670g330abh6cq0d4115l7597j2onnnd', '::1', '__ci_last_regenerate|i:1610618480;', '0000-00-00 00:00:00'),
('k7fq3p2gc80gb2ncq1hn50hakmoil87j', '::1', '__ci_last_regenerate|i:1610618501;', '0000-00-00 00:00:00'),
('kdrtqa10u4kgumhtnkqvg24p0nkh45s9', '::1', '__ci_last_regenerate|i:1610618599;', '0000-00-00 00:00:00'),
('kfosk8a60miti5eh528bfchhhmluqsq7', '::1', '__ci_last_regenerate|i:1610453335;', '0000-00-00 00:00:00'),
('lh3j1j2qfojloc6oomoo0j2u307ue3jt', '::1', '__ci_last_regenerate|i:1610622970;', '0000-00-00 00:00:00'),
('lr1ircpp4upsu1kv488rpjgq2upiu2qq', '::1', '__ci_last_regenerate|i:1610435346;', '0000-00-00 00:00:00'),
('mibmje54ie81v14gvccfku9rigv021eg', '::1', '__ci_last_regenerate|i:1610619787;', '0000-00-00 00:00:00'),
('mkft8gikrk94b88elhadngjk99l6l886', '::1', '__ci_last_regenerate|i:1610434267;', '0000-00-00 00:00:00'),
('mot7a0s77vt4prqf88s3fijl4c0c26ur', '::1', '__ci_last_regenerate|i:1610618820;', '0000-00-00 00:00:00'),
('mp8pm01md8msqn72tc3jc64o43mdr908', '::1', '__ci_last_regenerate|i:1610452942;', '0000-00-00 00:00:00'),
('mpsggrmrt45dvtfsg593e7bjeqadh36q', '::1', '__ci_last_regenerate|i:1610618086;', '0000-00-00 00:00:00'),
('n9t30g08l7gj363kt1a130qu7q0gepn3', '::1', '__ci_last_regenerate|i:1610617343;', '0000-00-00 00:00:00'),
('nbp6lf3aieo11aomtdeufcjg8k88bra3', '::1', '__ci_last_regenerate|i:1610618088;', '0000-00-00 00:00:00'),
('ndng351q57j3tuj6dcmafau1dchjj7g6', '::1', '__ci_last_regenerate|i:1610619793;', '0000-00-00 00:00:00'),
('noof9dss1rlfc07qdtof6ukhcsqrekdp', '::1', '__ci_last_regenerate|i:1610618499;', '0000-00-00 00:00:00'),
('nsr9j9ghebqbgdo2e20qe1alhombt7t0', '::1', '__ci_last_regenerate|i:1610622971;', '0000-00-00 00:00:00'),
('o1sce7g30aaigi90eikm6p9n2ahinsdu', '::1', '__ci_last_regenerate|i:1610263628;', '0000-00-00 00:00:00'),
('o81rvuv5nqnpbubfau69d1fpiahi53at', '::1', '__ci_last_regenerate|i:1610619786;', '0000-00-00 00:00:00'),
('op87oc3om9hljkgrtnvf0402ero9v4h8', '::1', '__ci_last_regenerate|i:1610618580;', '0000-00-00 00:00:00'),
('orvlfm09f44am4p4grtnv0l66ap4e9g8', '::1', '__ci_last_regenerate|i:1610622974;', '0000-00-00 00:00:00'),
('p46u76elqp78t1b2o5rrth7e2v439bc0', '::1', '__ci_last_regenerate|i:1610618485;', '0000-00-00 00:00:00'),
('p4t3gol8bq50ftlgngnud577lfalv278', '127.0.0.1', '__ci_last_regenerate|i:1610264216;', '0000-00-00 00:00:00'),
('phbtavqss3it6hi8oko505jc3ubd8m74', '::1', '__ci_last_regenerate|i:1610618491;', '0000-00-00 00:00:00'),
('phqg37ef70fu4jrhranc6iuddge9a9sk', '::1', '__ci_last_regenerate|i:1610618775;', '0000-00-00 00:00:00'),
('pq04h364gqst2vc92nj3025dali38278', '::1', '__ci_last_regenerate|i:1610434413;', '0000-00-00 00:00:00'),
('pua1u6u8cmm19m1ptfvqtl7e2fosunrp', '::1', '__ci_last_regenerate|i:1610618400;', '0000-00-00 00:00:00'),
('q07tf8b0cvnp77li2vm5ud8tifff7t5k', '::1', '__ci_last_regenerate|i:1610454500;', '0000-00-00 00:00:00'),
('qaon715pioas89m5tchp78ff1kro6enq', '127.0.0.1', '__ci_last_regenerate|i:1610266312;', '0000-00-00 00:00:00'),
('qbqsd32th7tqkd0h00ia7lqq1pgc8thb', '::1', '__ci_last_regenerate|i:1610454475;', '0000-00-00 00:00:00'),
('qd0n2kh76vmpsdrdg9c5nq07hib7oloj', '::1', '__ci_last_regenerate|i:1610619793;', '0000-00-00 00:00:00'),
('qdj36gvqb58qqig9r6f7q938jsv899ne', '127.0.0.1', '__ci_last_regenerate|i:1610264569;', '0000-00-00 00:00:00'),
('qljcj43gopq4da6qc0q2rql7bis7j8ot', '::1', '__ci_last_regenerate|i:1610618821;', '0000-00-00 00:00:00'),
('qmn55mto1t51k3jekf38g9n74ol28231', '::1', '__ci_last_regenerate|i:1610434286;', '0000-00-00 00:00:00'),
('qnortufhdeo29mdkkg99mo306qm9o55p', '::1', '__ci_last_regenerate|i:1610453369;', '0000-00-00 00:00:00'),
('r22causq873hp5spk0m3j242kgq9quk2', '::1', '__ci_last_regenerate|i:1610618824;', '0000-00-00 00:00:00'),
('r503kdfhchcfcb3u7ajpj00df4833g52', '::1', '__ci_last_regenerate|i:1610618080;', '0000-00-00 00:00:00'),
('rbn4gsoinnbghr188n27ka4i7rd445cf', '::1', '__ci_last_regenerate|i:1610618113;', '0000-00-00 00:00:00'),
('rspoeu2h3um3l879c877frclcmillo80', '::1', '__ci_last_regenerate|i:1610618506;', '0000-00-00 00:00:00'),
('rsrvglturp0gmnqtc5j5aivtr6tmcmrc', '::1', '__ci_last_regenerate|i:1610618482;', '0000-00-00 00:00:00'),
('s3s238pop8ufq914nss4jgmpqbidb6e2', '::1', '__ci_last_regenerate|i:1610453077;', '0000-00-00 00:00:00'),
('sdshujcu7i4jijslsoiq6e7eo062vtn1', '127.0.0.1', '__ci_last_regenerate|i:1610264609;', '0000-00-00 00:00:00'),
('sncj9jejit3o1bs5rd0044v9b8vdho6f', '::1', '__ci_last_regenerate|i:1610435589;', '0000-00-00 00:00:00'),
('sussjpubjf9grjvuah0qfo0i6iltup9g', '::1', '__ci_last_regenerate|i:1610618580;', '0000-00-00 00:00:00'),
('svonakcfkr374ndkh5d1mig0quabbea5', '::1', '__ci_last_regenerate|i:1610618480;', '0000-00-00 00:00:00'),
('t80v61jv0i9h1cfoqgv71u1k7l8rc14l', '::1', '__ci_last_regenerate|i:1610618578;', '0000-00-00 00:00:00'),
('t9dckm40o891l2ft7puantu8rkbn9pue', '::1', '__ci_last_regenerate|i:1610618083;', '0000-00-00 00:00:00'),
('tqb4tk4qhmop3c6vb2orld0kkspjtgs4', '::1', '__ci_last_regenerate|i:1610618499;', '0000-00-00 00:00:00'),
('u5tb2mllm5bn8oeijnohp8rtl3t16gqp', '::1', '__ci_last_regenerate|i:1610263855;', '0000-00-00 00:00:00'),
('umi4s8goqsvqpkiiv5torqjrpb0o8fub', '::1', '__ci_last_regenerate|i:1610619793;', '0000-00-00 00:00:00'),
('upkscvu3sc96h8eg9p3v1d3tubvf5o9i', '::1', '__ci_last_regenerate|i:1610619786;', '0000-00-00 00:00:00'),
('uuhaogcoflkc7sb6kgvrp6v0eb5bhfvh', '::1', '__ci_last_regenerate|i:1610618766;', '0000-00-00 00:00:00'),
('uvgdc0nl0v6v4g7vdttr68u6o9edg0fo', '::1', '__ci_last_regenerate|i:1610434269;', '0000-00-00 00:00:00'),
('v8bvjjad9ratvcd9rm2ebnqpdcehi9d3', '::1', '__ci_last_regenerate|i:1610618790;', '0000-00-00 00:00:00'),
('v98ovcueq7e16leem9d3pt37j52e1bnq', '::1', '__ci_last_regenerate|i:1610618819;', '0000-00-00 00:00:00'),
('vv6ddjegb4gg1vlpho0pd5d8vdqam4je', '::1', '__ci_last_regenerate|i:1610618441;', '0000-00-00 00:00:00'),
('vvllio2tt0ft9nvms07qikb8p92okfag', '::1', '__ci_last_regenerate|i:1610622975;', '0000-00-00 00:00:00'),
('vvsbtre15eu73vvogka63pfiopj1n5eb', '127.0.0.1', '__ci_last_regenerate|i:1610266336;', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `direct_access_master`
--

CREATE TABLE `direct_access_master` (
  `DA_ID` int(11) NOT NULL,
  `DA_Title` varchar(100) NOT NULL,
  `DA_Description` varchar(200) NOT NULL,
  `DA_Icon` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `direct_access_master`
--

INSERT INTO `direct_access_master` (`DA_ID`, `DA_Title`, `DA_Description`, `DA_Icon`) VALUES
(1, 'I''ll send you a video message', 'Get a short video message from me, perfect for birthdays or just to make someones day.', ''),
(2, 'I''ll direct message your family or friend', 'I''ll send a direct message to someone you care about saying whatever you chose.', ''),
(3, 'I''ll send your loved one a card for a special occasion', 'I''ll mail a physical card to whoever you want for a special occasion.', ''),
(4, 'We''ll have a short phone call', 'I''ll call you or whoever you tell me to call for a quick phone conversation.', '');

-- --------------------------------------------------------

--
-- Table structure for table `joining_master`
--

CREATE TABLE `joining_master` (
  `JM_ID` int(11) NOT NULL,
  `JM_Name` varchar(50) NOT NULL,
  `JM_Email` varchar(50) NOT NULL,
  `JM_Password` varchar(100) NOT NULL,
  `JM_User_Profile_Url` varchar(50) NOT NULL,
  `JM_Insta_Url` varchar(200) NOT NULL,
  `JM_Utube_Url` varchar(200) DEFAULT NULL,
  `JM_Twiter_Url` varchar(100) DEFAULT NULL,
  `JM_Profile_Pic` varchar(200) DEFAULT NULL,
  `JM_FB_Url` varchar(200) DEFAULT NULL,
  `JM_Tiktok_Url` varchar(200) DEFAULT NULL,
  `JM_Phone` varchar(12) NOT NULL,
  `Create_Date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Created_By` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `joining_master`
--

INSERT INTO `joining_master` (`JM_ID`, `JM_Name`, `JM_Email`, `JM_Password`, `JM_User_Profile_Url`, `JM_Insta_Url`, `JM_Utube_Url`, `JM_Twiter_Url`, `JM_Profile_Pic`, `JM_FB_Url`, `JM_Tiktok_Url`, `JM_Phone`, `Create_Date`, `Created_By`) VALUES
(9, 'bob', 'bob@gmail.com', '$2b$10$NMPYrrWZWm6Rk5gmC2t8peuiQggNMUZV9kxhLpMG80kBPP64CB3ym', 'bob', '', NULL, NULL, 'profile_pic_9_1484667200835PunjabiTurbanPhotoSuit2.jpg', NULL, NULL, '', '2021-01-23 12:57:47', '');

-- --------------------------------------------------------

--
-- Table structure for table `link_master`
--

CREATE TABLE `link_master` (
  `LM_ID` int(11) NOT NULL,
  `JM_ID` int(11) NOT NULL COMMENT 'joining_master.JM_ID',
  `LM_Title` varchar(50) NOT NULL,
  `LM_Url` varchar(100) NOT NULL,
  `LM_Image` varchar(200) NOT NULL,
  `LM_Icon` varchar(100) NOT NULL,
  `LM_Active` int(1) NOT NULL DEFAULT '1',
  `LM_Who_Will_See` varchar(1) NOT NULL,
  `Create_Date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `link_master`
--

INSERT INTO `link_master` (`LM_ID`, `JM_ID`, `LM_Title`, `LM_Url`, `LM_Image`, `LM_Icon`, `LM_Active`, `LM_Who_Will_See`, `Create_Date`) VALUES
(44, 5, 'aaaaaaaaaa', 'ddd', 'Profile/sam_5/Links/a.jpg', '', 1, '', '2021-01-23 12:00:22'),
(45, 9, 'Instagram', 'bob', 'Profile/bob_9/Links/insta.png', '', 1, '', '2021-01-23 12:57:54'),
(46, 9, 'YouTube', 'bob', 'Profile/bob_9/Links/youtube.png', '', 1, '', '2021-01-23 12:57:54'),
(54, 9, 'ccc', 'xxxx', 'Profile/bob_9/Links/Logo_2.png', '', 1, '3', '2021-01-23 13:51:42');

-- --------------------------------------------------------

--
-- Table structure for table `theme_master`
--

CREATE TABLE `theme_master` (
  `TM_ID` int(6) NOT NULL,
  `TM_Back_Color` varchar(20) NOT NULL COMMENT 'Pick your overall background color.',
  `TM_Back_Image` varchar(100) NOT NULL COMMENT 'Add a background image.',
  `TM_Item_Color` varchar(20) NOT NULL COMMENT 'This is the color that the items on your profile will be.',
  `TM_Item_Style` varchar(50) NOT NULL,
  `TM_Highlight_Color` varchar(20) NOT NULL COMMENT 'This is used for icons, your follow button and other highlighted elements.',
  `TM_Font` varchar(100) NOT NULL COMMENT 'Chose a font for your entire profile.',
  `TM_Font_Color` varchar(20) NOT NULL,
  `TM_Bio_Color` varchar(20) NOT NULL COMMENT 'This color will be used on your name, bio and any other text that overlays your background.',
  `TM_Active` int(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `theme_master`
--

INSERT INTO `theme_master` (`TM_ID`, `TM_Back_Color`, `TM_Back_Image`, `TM_Item_Color`, `TM_Item_Style`, `TM_Highlight_Color`, `TM_Font`, `TM_Font_Color`, `TM_Bio_Color`, `TM_Active`) VALUES
(1, '#FC2070', 'theme/theme_master_1.svg', '', '', '', 'consolas', '#333333', '', 1),
(2, '#3DA5DF', 'theme/theme_master_2.svg', '', '', '', 'consolas', '#333333', '', 1),
(3, '#F25F25', 'theme/theme_master_3.svg', '', '', '', 'consolas', '#333333', '', 1),
(4, '#276E57', 'theme/theme_master_4.svg', '', '', '', 'consolas', '#333333', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `theme_master_user`
--

CREATE TABLE `theme_master_user` (
  `TMU_ID` int(6) NOT NULL,
  `TM_ID` int(6) NOT NULL COMMENT 'theme_master.YM_ID',
  `JM_ID` int(6) NOT NULL COMMENT 'joining_master.JM_ID',
  `TM_Back_Color` varchar(20) NOT NULL COMMENT 'Pick your overall background color.',
  `TM_Back_Image` varchar(100) NOT NULL COMMENT 'Add a background image.',
  `TM_Item_Color` varchar(20) NOT NULL COMMENT 'This is the color that the items on your profile will be.',
  `TM_Item_Style` varchar(50) NOT NULL,
  `TM_Highlight_Color` varchar(20) NOT NULL COMMENT 'This is used for icons, your follow button and other highlighted elements.',
  `TM_Font` varchar(100) NOT NULL COMMENT 'Chose a font for your entire profile.',
  `TM_Font_Color` varchar(20) NOT NULL,
  `TM_Bio_Color` varchar(20) NOT NULL COMMENT 'This color will be used on your name, bio and any other text that overlays your background.',
  `TM_Active` int(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `theme_master_user`
--

INSERT INTO `theme_master_user` (`TMU_ID`, `TM_ID`, `JM_ID`, `TM_Back_Color`, `TM_Back_Image`, `TM_Item_Color`, `TM_Item_Style`, `TM_Highlight_Color`, `TM_Font`, `TM_Font_Color`, `TM_Bio_Color`, `TM_Active`) VALUES
(6, 4, 9, '#276E57', 'theme/theme_master_4.svg', '', '', '', 'consolas', '#333333', '', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ci_sessions`
--
ALTER TABLE `ci_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `direct_access_master`
--
ALTER TABLE `direct_access_master`
  ADD PRIMARY KEY (`DA_ID`);

--
-- Indexes for table `joining_master`
--
ALTER TABLE `joining_master`
  ADD PRIMARY KEY (`JM_ID`);

--
-- Indexes for table `link_master`
--
ALTER TABLE `link_master`
  ADD PRIMARY KEY (`LM_ID`);

--
-- Indexes for table `theme_master`
--
ALTER TABLE `theme_master`
  ADD PRIMARY KEY (`TM_ID`);

--
-- Indexes for table `theme_master_user`
--
ALTER TABLE `theme_master_user`
  ADD PRIMARY KEY (`TMU_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `direct_access_master`
--
ALTER TABLE `direct_access_master`
  MODIFY `DA_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `joining_master`
--
ALTER TABLE `joining_master`
  MODIFY `JM_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `link_master`
--
ALTER TABLE `link_master`
  MODIFY `LM_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
--
-- AUTO_INCREMENT for table `theme_master`
--
ALTER TABLE `theme_master`
  MODIFY `TM_ID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `theme_master_user`
--
ALTER TABLE `theme_master_user`
  MODIFY `TMU_ID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
