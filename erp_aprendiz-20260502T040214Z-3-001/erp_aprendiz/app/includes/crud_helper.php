<?php
/**
 * Helper genérico para renderizar Grid + Form de qualquer tabela
 * Recebe a configuração e renderiza o CRUD completo
 */
require_once __DIR__ . '/../models/CrudModel.php';

function renderCrud(array $config): void {
    $db = getConnection();
    $model = new CrudModel($db, $config['table'], $config['pk'], $config['columns'], $config['searchable'] ?? []);

    $action = $_GET['action'] ?? 'list';
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $msg = $_SESSION['flash_msg'] ?? null;
    $msgType = $_SESSION['flash_type'] ?? 'info';
    unset($_SESSION['flash_msg'], $_SESSION['flash_type']);

    // Handle POST (insert/update)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $postAction = $_POST['_action'] ?? '';
        $postId = isset($_POST['_id']) ? (int)$_POST['_id'] : 0;

        try {
            if ($postAction === 'insert') {
                $model->insert($_POST);
                $_SESSION['flash_msg'] = 'Registro incluído com sucesso!';
                $_SESSION['flash_type'] = 'success';
            } elseif ($postAction === 'update' && $postId > 0) {
                $model->update($postId, $_POST);
                $_SESSION['flash_msg'] = 'Registro atualizado com sucesso!';
                $_SESSION['flash_type'] = 'success';
            }
        } catch (Exception $e) {
            $_SESSION['flash_msg'] = 'Erro: ' . $e->getMessage();
            $_SESSION['flash_type'] = 'danger';
        }
        header('Location: index.php?mod=' . $config['mod']);
        exit;
    }

    // Handle DELETE
    if ($action === 'delete' && $id > 0) {
        try {
            $model->delete($id);
            $_SESSION['flash_msg'] = 'Registro excluído com sucesso!';
            $_SESSION['flash_type'] = 'success';
        } catch (Exception $e) {
            $_SESSION['flash_msg'] = 'Erro ao excluir: ' . $e->getMessage();
            $_SESSION['flash_type'] = 'danger';
        }
        header('Location: index.php?mod=' . $config['mod']);
        exit;
    }

    require_once __DIR__ . '/../includes/header.php';

    // Flash message
    if ($msg) {
        echo '<div class="alert alert-' . $msgType . '"><i class="fas fa-' . ($msgType === 'success' ? 'check-circle' : 'exclamation-circle') . '"></i> ' . htmlspecialchars($msg) . '</div>';
    }

    if ($action === 'new' || $action === 'edit') {
        // ========== FORM ==========
        $row = ($action === 'edit' && $id > 0) ? $model->find($id) : [];
        $isEdit = !empty($row);

        // Load lookups for FK fields
        $lookups = [];
        if (!empty($config['fields'])) {
            foreach ($config['fields'] as $field) {
                if (($field['type'] ?? '') === 'select' && !empty($field['lookup'])) {
                    $lk = $field['lookup'];
                    try {
                        $lookups[$field['name']] = $db->query("SELECT `{$lk['key']}`, `{$lk['label']}` FROM `{$lk['table']}` ORDER BY `{$lk['label']}`")->fetchAll();
                    } catch (Exception $e) {
                        $lookups[$field['name']] = [];
                    }
                }
            }
        }
        ?>
        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-<?= $isEdit ? 'edit' : 'plus-circle' ?>" style="color:var(--primary-light)"></i> &nbsp;<?= $isEdit ? 'Editar' : 'Novo' ?> <?= $config['singular'] ?></h3>
                <a href="index.php?mod=<?= $config['mod'] ?>" class="btn btn-sm btn-secondary"><i class="fas fa-arrow-left"></i> Voltar</a>
            </div>
            <form method="POST" action="index.php?mod=<?= $config['mod'] ?>">
                <input type="hidden" name="_action" value="<?= $isEdit ? 'update' : 'insert' ?>">
                <?php if ($isEdit): ?><input type="hidden" name="_id" value="<?= $id ?>"><?php endif; ?>

                <div class="form-row">
                <?php foreach ($config['fields'] as $field):
                    $name = $field['name'];
                    $label = $field['label'];
                    $type = $field['type'] ?? 'text';
                    $required = !empty($field['required']) ? 'required' : '';
                    $value = htmlspecialchars($row[$name] ?? $field['default'] ?? '');
                    $span = $field['span'] ?? '';
                    $spanStyle = $span ? "grid-column: span {$span}" : '';
                ?>
                    <div class="form-group" <?= $spanStyle ? "style=\"{$spanStyle}\"" : '' ?>>
                        <label for="<?= $name ?>"><?= $label ?></label>
                        <?php if ($type === 'select' && !empty($field['options'])): ?>
                            <select name="<?= $name ?>" id="<?= $name ?>" class="form-control" <?= $required ?>>
                                <option value="">— Selecione —</option>
                                <?php foreach ($field['options'] as $optVal => $optLabel): ?>
                                    <option value="<?= htmlspecialchars($optVal) ?>" <?= ($row[$name] ?? '') == $optVal ? 'selected' : '' ?>><?= htmlspecialchars($optLabel) ?></option>
                                <?php endforeach; ?>
                            </select>
                        <?php elseif ($type === 'select' && !empty($field['lookup'])): ?>
                            <select name="<?= $name ?>" id="<?= $name ?>" class="form-control" <?= $required ?>>
                                <option value="">— Selecione —</option>
                                <?php foreach ($lookups[$name] ?? [] as $opt): ?>
                                    <option value="<?= $opt[$field['lookup']['key']] ?>" <?= ($row[$name] ?? '') == $opt[$field['lookup']['key']] ? 'selected' : '' ?>><?= htmlspecialchars($opt[$field['lookup']['label']]) ?></option>
                                <?php endforeach; ?>
                            </select>
                        <?php elseif ($type === 'textarea'): ?>
                            <textarea name="<?= $name ?>" id="<?= $name ?>" class="form-control" <?= $required ?>><?= $value ?></textarea>
                        <?php else: ?>
                            <input type="<?= $type ?>" name="<?= $name ?>" id="<?= $name ?>" class="form-control" value="<?= $value ?>" <?= $required ?>>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
                </div>

                <div style="display:flex;gap:10px;margin-top:20px">
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Salvar</button>
                    <a href="index.php?mod=<?= $config['mod'] ?>" class="btn btn-secondary">Cancelar</a>
                </div>
            </form>
        </div>
        <?php
    } else {
        // ========== GRID ==========
        $search = $_GET['q'] ?? '';
        $page = max(1, (int)($_GET['page'] ?? 1));
        $orderBy = $_GET['order'] ?? '';
        $orderDir = $_GET['dir'] ?? 'ASC';
        $result = $model->list($search, $page, 15, $orderBy, $orderDir);
        ?>
        <div class="card">
            <div class="toolbar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <form method="GET"><input type="hidden" name="mod" value="<?= $config['mod'] ?>">
                    <input type="text" name="q" placeholder="Buscar <?= strtolower($config['plural']) ?>..." value="<?= htmlspecialchars($search) ?>"></form>
                </div>
                <a href="index.php?mod=<?= $config['mod'] ?>&action=new" class="btn btn-primary"><i class="fas fa-plus"></i> Novo <?= $config['singular'] ?></a>
            </div>

            <?php if (empty($result['rows'])): ?>
                <p style="color:var(--text-muted);text-align:center;padding:40px"><i class="fas fa-inbox" style="font-size:32px;display:block;margin-bottom:12px"></i>Nenhum registro encontrado.</p>
            <?php else: ?>
            <div class="table-wrapper">
                <table>
                    <thead><tr>
                        <?php foreach ($config['grid_columns'] as $col => $label):
                            $newDir = ($orderBy === $col && $orderDir === 'ASC') ? 'DESC' : 'ASC';
                            $arrow = ($orderBy === $col) ? ($orderDir === 'ASC' ? ' ▲' : ' ▼') : '';
                        ?>
                            <th><a href="index.php?mod=<?= $config['mod'] ?>&order=<?= $col ?>&dir=<?= $newDir ?>&q=<?= urlencode($search) ?>" style="color:inherit;text-decoration:none"><?= $label ?><?= $arrow ?></a></th>
                        <?php endforeach; ?>
                        <th style="width:100px">Ações</th>
                    </tr></thead>
                    <tbody>
                    <?php foreach ($result['rows'] as $row): ?>
                        <tr>
                            <?php foreach ($config['grid_columns'] as $col => $label):
                                $val = $row[$col] ?? '';
                                // Format badges for status fields
                                if (!empty($config['badge_fields'][$col])) {
                                    $badges = $config['badge_fields'][$col];
                                    $badgeClass = $badges[$val] ?? 'badge-info';
                                    $val = '<span class="badge ' . $badgeClass . '">' . htmlspecialchars($val) . '</span>';
                                } elseif (in_array($col, ['data_inicio','data_fim','data_cadastro','data_matricula','nascimento','data_emissao_rg','prova_data']) && $val) {
                                    $val = date('d/m/Y', strtotime($val));
                                } else {
                                    $val = htmlspecialchars((string)$val);
                                }
                            ?>
                                <td><?= $val ?></td>
                            <?php endforeach; ?>
                            <td>
                                <div style="display:flex;gap:4px">
                                    <a href="index.php?mod=<?= $config['mod'] ?>&action=edit&id=<?= $row[$config['pk']] ?>" class="btn btn-sm btn-icon btn-secondary" title="Editar"><i class="fas fa-pen"></i></a>
                                    <button onclick="confirmDelete('index.php?mod=<?= $config['mod'] ?>&action=delete&id=<?= $row[$config['pk']] ?>', '<?= htmlspecialchars(addslashes($row[$config['grid_columns_keys'][0]] ?? $row[$config['pk']] ?? '')) ?>')" class="btn btn-sm btn-icon btn-danger" title="Excluir"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <?php if ($result['totalPages'] > 1): ?>
            <div class="pagination">
                <span class="info"><?= $result['total'] ?> registro(s)</span>
                <?php if ($page > 1): ?><a href="index.php?mod=<?= $config['mod'] ?>&page=<?= $page-1 ?>&q=<?= urlencode($search) ?>&order=<?= $orderBy ?>&dir=<?= $orderDir ?>">‹ Anterior</a><?php endif; ?>
                <?php for ($i = max(1,$page-2); $i <= min($result['totalPages'],$page+2); $i++): ?>
                    <?php if ($i === $page): ?><span class="active"><?= $i ?></span>
                    <?php else: ?><a href="index.php?mod=<?= $config['mod'] ?>&page=<?= $i ?>&q=<?= urlencode($search) ?>&order=<?= $orderBy ?>&dir=<?= $orderDir ?>"><?= $i ?></a><?php endif; ?>
                <?php endfor; ?>
                <?php if ($page < $result['totalPages']): ?><a href="index.php?mod=<?= $config['mod'] ?>&page=<?= $page+1 ?>&q=<?= urlencode($search) ?>&order=<?= $orderBy ?>&dir=<?= $orderDir ?>">Próxima ›</a><?php endif; ?>
            </div>
            <?php endif; ?>
            <?php endif; ?>
        </div>
        <?php
    }

    require_once __DIR__ . '/../includes/footer.php';
}

/**
 * Helper para renderizar consulta de Views (somente leitura)
 */
function renderViewGrid(array $config): void {
    $db = getConnection();
    $model = new CrudModel($db, $config['view'], 'id', [], []);

    $search = $_GET['q'] ?? '';
    $page = max(1, (int)($_GET['page'] ?? 1));
    $orderBy = $_GET['order'] ?? '';
    $orderDir = $_GET['dir'] ?? 'ASC';

    $viewCols = array_keys($config['grid_columns']);
    $result = $model->listView($config['view'], $viewCols, $search, $page, 15, $orderBy, $orderDir);

    require_once __DIR__ . '/../includes/header.php';
    ?>
    <div class="card">
        <div class="toolbar">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <form method="GET"><input type="hidden" name="mod" value="<?= $config['mod'] ?>">
                <input type="text" name="q" placeholder="Buscar..." value="<?= htmlspecialchars($search) ?>"></form>
            </div>
            <span class="badge badge-info"><i class="fas fa-eye"></i>&nbsp; Consulta (somente leitura)</span>
        </div>

        <?php if (empty($result['rows'])): ?>
            <p style="color:var(--text-muted);text-align:center;padding:40px"><i class="fas fa-inbox" style="font-size:32px;display:block;margin-bottom:12px"></i>Nenhum registro encontrado.</p>
        <?php else: ?>
        <div class="table-wrapper">
            <table>
                <thead><tr>
                    <?php foreach ($config['grid_columns'] as $col => $label):
                        $newDir = ($orderBy === $col && $orderDir === 'ASC') ? 'DESC' : 'ASC';
                        $arrow = ($orderBy === $col) ? ($orderDir === 'ASC' ? ' ▲' : ' ▼') : '';
                    ?>
                        <th><a href="index.php?mod=<?= $config['mod'] ?>&order=<?= $col ?>&dir=<?= $newDir ?>&q=<?= urlencode($search) ?>" style="color:inherit;text-decoration:none"><?= $label ?><?= $arrow ?></a></th>
                    <?php endforeach; ?>
                </tr></thead>
                <tbody>
                <?php foreach ($result['rows'] as $row): ?>
                    <tr>
                        <?php foreach ($config['grid_columns'] as $col => $label):
                            $val = $row[$col] ?? '';
                            if (!empty($config['badge_fields'][$col])) {
                                $badges = $config['badge_fields'][$col];
                                $badgeClass = $badges[$val] ?? 'badge-info';
                                $val = '<span class="badge ' . $badgeClass . '">' . htmlspecialchars($val) . '</span>';
                            } else {
                                $val = htmlspecialchars((string)$val);
                            }
                        ?>
                            <td><?= $val ?></td>
                        <?php endforeach; ?>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <?php if ($result['totalPages'] > 1): ?>
        <div class="pagination">
            <span class="info"><?= $result['total'] ?> registro(s)</span>
            <?php if ($page > 1): ?><a href="index.php?mod=<?= $config['mod'] ?>&page=<?= $page-1 ?>&q=<?= urlencode($search) ?>">‹ Anterior</a><?php endif; ?>
            <?php for ($i = max(1,$page-2); $i <= min($result['totalPages'],$page+2); $i++): ?>
                <?php if ($i === $page): ?><span class="active"><?= $i ?></span>
                <?php else: ?><a href="index.php?mod=<?= $config['mod'] ?>&page=<?= $i ?>&q=<?= urlencode($search) ?>"><?= $i ?></a><?php endif; ?>
            <?php endfor; ?>
            <?php if ($page < $result['totalPages']): ?><a href="index.php?mod=<?= $config['mod'] ?>&page=<?= $page+1 ?>&q=<?= urlencode($search) ?>">Próxima ›</a><?php endif; ?>
        </div>
        <?php endif; ?>
        <?php endif; ?>
    </div>
    <?php
    require_once __DIR__ . '/../includes/footer.php';
}
