<?php
/**
 * Dashboard — Visão geral do sistema
 */
require_once __DIR__ . '/../config/database.php';
$db = getConnection();

$stats = [];
$tables = [
    ['inscricao_2026', 'Inscrições', 'fas fa-file-signature'],
    ['cadastro_jovem', 'Jovens Cadastrados', 'fas fa-user-graduate'],
    ['educador', 'Educadores', 'fas fa-chalkboard-teacher'],
    ['projeto', 'Projetos', 'fas fa-project-diagram'],
    ['curso', 'Cursos', 'fas fa-book'],
    ['turma', 'Turmas', 'fas fa-chalkboard'],
];

foreach ($tables as $t) {
    try {
        $count = $db->query("SELECT COUNT(*) FROM `{$t[0]}`")->fetchColumn();
    } catch (Exception $e) {
        $count = 0;
    }
    $stats[] = ['count' => $count, 'label' => $t[1], 'icon' => $t[2]];
}

// Últimas inscrições
try {
    $ultimas = $db->query("SELECT id, nome_completo, cpf, status_processo, data_cadastro FROM inscricao_2026 ORDER BY id DESC LIMIT 5")->fetchAll();
} catch (Exception $e) {
    $ultimas = [];
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="stats-grid">
    <?php foreach ($stats as $s): ?>
    <div class="stat-card">
        <div class="stat-icon"><i class="<?= $s['icon'] ?>"></i></div>
        <div class="stat-info">
            <h4><?= $s['count'] ?></h4>
            <p><?= $s['label'] ?></p>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<div class="card">
    <div class="card-header">
        <h3><i class="fas fa-clock" style="color:var(--primary-light)"></i> &nbsp;Últimas Inscrições</h3>
        <a href="index.php?mod=inscricao_2026" class="btn btn-sm btn-secondary">Ver todas</a>
    </div>
    <?php if (empty($ultimas)): ?>
        <p style="color:var(--text-muted);text-align:center;padding:20px">Nenhuma inscrição encontrada.</p>
    <?php else: ?>
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Status</th>
                    <th>Data</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($ultimas as $row): ?>
                <tr>
                    <td><?= $row['id'] ?></td>
                    <td style="color:var(--text-primary);font-weight:500"><?= htmlspecialchars($row['nome_completo'] ?? '') ?></td>
                    <td><?= htmlspecialchars($row['cpf'] ?? '') ?></td>
                    <td>
                        <?php
                        $status = $row['status_processo'] ?? 'Pendente';
                        $badge = match($status) {
                            'Aprovado' => 'badge-success',
                            'Reprovado' => 'badge-danger',
                            'Pendente','1' => 'badge-warning',
                            default => 'badge-info',
                        };
                        ?>
                        <span class="badge <?= $badge ?>"><?= htmlspecialchars($status) ?></span>
                    </td>
                    <td><?= $row['data_cadastro'] ? date('d/m/Y', strtotime($row['data_cadastro'])) : '-' ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
