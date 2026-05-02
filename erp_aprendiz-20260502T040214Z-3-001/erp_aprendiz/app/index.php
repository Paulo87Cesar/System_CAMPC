<?php
/**
 * ERP Jovem Aprendiz — Roteador Principal
 */
require_once __DIR__ . '/config/app.php';

$mod = $_GET['mod'] ?? 'dashboard';
$allowed = ['dashboard','inscricao_2026','inscricao_familia','cadastro_jovem','educador','projeto','programa','curso','disciplina','turma','matricula_turma','boletim_nota','vw_boletim_jovem','vw_matriculas_jovem'];

if (!in_array($mod, $allowed)) {
    $mod = 'dashboard';
}

$file = __DIR__ . '/modules/' . $mod . '.php';
if (file_exists($file)) {
    require $file;
} else {
    require __DIR__ . '/includes/header.php';
    echo '<div class="card"><p style="color:var(--text-muted);text-align:center;padding:40px">Módulo <strong>' . htmlspecialchars($mod) . '</strong> em desenvolvimento.</p></div>';
    require __DIR__ . '/includes/footer.php';
}
