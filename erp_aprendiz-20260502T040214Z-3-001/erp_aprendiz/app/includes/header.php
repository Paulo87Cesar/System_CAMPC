<?php
/**
 * ERP Jovem Aprendiz — Layout Principal
 * Inclui sidebar, topbar e área de conteúdo
 */
require_once __DIR__ . '/../config/app.php';

$currentModule = $_GET['mod'] ?? 'dashboard';
$modules = getModules();

// Determinar título da página
$pageTitle = 'Dashboard';
foreach ($modules as $key => $mod) {
    if ($key === $currentModule) {
        $pageTitle = $mod['label'];
        break;
    }
    if (isset($mod['children'])) {
        foreach ($mod['children'] as $childKey => $child) {
            if ($childKey === $currentModule) {
                $pageTitle = $child['label'];
                break 2;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Sistema ERP Jovem Aprendiz - Patrulheiros Campinas">
    <title><?= htmlspecialchars($pageTitle) ?> — <?= APP_NAME ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>

<!-- SIDEBAR -->
<aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
        <div class="brand-icon"><i class="fas fa-shield-alt"></i></div>
        <div>
            <h2><?= APP_NAME ?></h2>
            <small><?= APP_ORG ?></small>
        </div>
    </div>
    <nav class="sidebar-nav">
        <?php foreach ($modules as $key => $mod): ?>
            <?php if (isset($mod['children'])): ?>
                <div class="nav-group <?= in_array($currentModule, array_keys($mod['children'])) ? 'open' : '' ?>">
                    <div class="nav-group-title" onclick="this.parentElement.classList.toggle('open')">
                        <span><i class="<?= $mod['icon'] ?>"></i> &nbsp;<?= $mod['label'] ?></span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="nav-group-children">
                        <?php foreach ($mod['children'] as $childKey => $child): ?>
                            <a href="index.php?mod=<?= $childKey ?>" class="nav-item <?= $currentModule === $childKey ? 'active' : '' ?>">
                                <i class="<?= $child['icon'] ?>"></i> <?= $child['label'] ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php else: ?>
                <a href="index.php?mod=<?= $key ?>" class="nav-item <?= $currentModule === $key ? 'active' : '' ?>">
                    <i class="<?= $mod['icon'] ?>"></i> <?= $mod['label'] ?>
                </a>
            <?php endif; ?>
        <?php endforeach; ?>
    </nav>
</aside>

<!-- MAIN -->
<div class="main-content">
    <header class="topbar">
        <div>
            <div class="breadcrumb"><?= APP_ORG ?> <span>/ <?= htmlspecialchars($pageTitle) ?></span></div>
            <h1><?= htmlspecialchars($pageTitle) ?></h1>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:12px;color:var(--text-muted)">v<?= APP_VERSION ?></span>
        </div>
    </header>
    <div class="page-content">
