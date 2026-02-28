<?php
// test_connection.php
try {
    $host = '192.168.99.165';
    $port = '3030';
    $dbname = 'rsj_grhasia';
    $username = 'postgres'; // atau username PostgreSQL Anda
    $password = '@@30Pr3scr1ption30@@';
    
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $username, $password);
    echo "✅ Koneksi PostgreSQL berhasil!\n";
    echo "Server info: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "\n";
} catch(PDOException $e) {
    echo "❌ Koneksi PostgreSQL gagal: " . $e->getMessage() . "\n";
}
?>