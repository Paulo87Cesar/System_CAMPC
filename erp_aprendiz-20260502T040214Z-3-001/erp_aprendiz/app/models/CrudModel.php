<?php
/**
 * ERP Jovem Aprendiz — Classe CRUD genérica
 * Fornece operações padrão para todas as tabelas
 */

class CrudModel {
    protected PDO $db;
    protected string $table;
    protected string $primaryKey;
    protected array $columns;
    protected array $searchable;

    public function __construct(PDO $db, string $table, string $primaryKey, array $columns, array $searchable = []) {
        $this->db = $db;
        $this->table = $table;
        $this->primaryKey = $primaryKey;
        $this->columns = $columns;
        $this->searchable = $searchable ?: $columns;
    }

    /**
     * Listar registros com busca e paginação
     */
    public function list(string $search = '', int $page = 1, int $perPage = 15, string $orderBy = '', string $orderDir = 'ASC'): array {
        $offset = ($page - 1) * $perPage;
        $where = '';
        $params = [];

        if ($search !== '') {
            $conditions = [];
            foreach ($this->searchable as $col) {
                $conditions[] = "`{$col}` LIKE :search";
            }
            $where = 'WHERE (' . implode(' OR ', $conditions) . ')';
            $params[':search'] = "%{$search}%";
        }

        if ($orderBy === '' || !in_array($orderBy, $this->columns)) {
            $orderBy = $this->primaryKey;
        }
        $orderDir = strtoupper($orderDir) === 'DESC' ? 'DESC' : 'ASC';

        // Count
        $countSql = "SELECT COUNT(*) FROM `{$this->table}` {$where}";
        $stmt = $this->db->prepare($countSql);
        $stmt->execute($params);
        $total = (int)$stmt->fetchColumn();

        // Data
        $sql = "SELECT * FROM `{$this->table}` {$where} ORDER BY `{$orderBy}` {$orderDir} LIMIT {$perPage} OFFSET {$offset}";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        return [
            'rows'      => $rows,
            'total'     => $total,
            'page'      => $page,
            'perPage'   => $perPage,
            'totalPages'=> (int)ceil($total / $perPage),
        ];
    }

    /**
     * Buscar por ID
     */
    public function find(int $id): ?array {
        $sql = "SELECT * FROM `{$this->table}` WHERE `{$this->primaryKey}` = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /**
     * Inserir registro
     */
    public function insert(array $data): int {
        $filtered = array_intersect_key($data, array_flip($this->columns));
        $cols = array_keys($filtered);
        $placeholders = array_map(fn($c) => ":{$c}", $cols);
        $sql = "INSERT INTO `{$this->table}` (`" . implode('`, `', $cols) . "`) VALUES (" . implode(', ', $placeholders) . ")";
        $stmt = $this->db->prepare($sql);
        foreach ($filtered as $key => $value) {
            $stmt->bindValue(":{$key}", $value === '' ? null : $value);
        }
        $stmt->execute();
        return (int)$this->db->lastInsertId();
    }

    /**
     * Atualizar registro
     */
    public function update(int $id, array $data): bool {
        $filtered = array_intersect_key($data, array_flip($this->columns));
        $sets = [];
        foreach ($filtered as $col => $val) {
            $sets[] = "`{$col}` = :{$col}";
        }
        $sql = "UPDATE `{$this->table}` SET " . implode(', ', $sets) . " WHERE `{$this->primaryKey}` = :_id";
        $stmt = $this->db->prepare($sql);
        foreach ($filtered as $key => $value) {
            $stmt->bindValue(":{$key}", $value === '' ? null : $value);
        }
        $stmt->bindValue(':_id', $id);
        return $stmt->execute();
    }

    /**
     * Excluir registro
     */
    public function delete(int $id): bool {
        $sql = "DELETE FROM `{$this->table}` WHERE `{$this->primaryKey}` = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Buscar todos (para selects / lookups)
     */
    public function all(string $orderBy = ''): array {
        if ($orderBy === '') $orderBy = $this->primaryKey;
        $sql = "SELECT * FROM `{$this->table}` ORDER BY `{$orderBy}`";
        return $this->db->query($sql)->fetchAll();
    }

    /**
     * Consultar view (somente leitura, com busca e paginação)
     */
    public function listView(string $viewName, array $viewColumns, string $search = '', int $page = 1, int $perPage = 15, string $orderBy = '', string $orderDir = 'ASC'): array {
        $offset = ($page - 1) * $perPage;
        $where = '';
        $params = [];

        if ($search !== '') {
            $conditions = [];
            foreach ($viewColumns as $col) {
                $conditions[] = "`{$col}` LIKE :search";
            }
            $where = 'WHERE (' . implode(' OR ', $conditions) . ')';
            $params[':search'] = "%{$search}%";
        }

        if ($orderBy === '' || !in_array($orderBy, $viewColumns)) {
            $orderBy = $viewColumns[0] ?? 'id';
        }
        $orderDir = strtoupper($orderDir) === 'DESC' ? 'DESC' : 'ASC';

        $countSql = "SELECT COUNT(*) FROM `{$viewName}` {$where}";
        $stmt = $this->db->prepare($countSql);
        $stmt->execute($params);
        $total = (int)$stmt->fetchColumn();

        $sql = "SELECT * FROM `{$viewName}` {$where} ORDER BY `{$orderBy}` {$orderDir} LIMIT {$perPage} OFFSET {$offset}";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        return [
            'rows'      => $rows,
            'total'     => $total,
            'page'      => $page,
            'perPage'   => $perPage,
            'totalPages'=> (int)ceil($total / $perPage),
        ];
    }
}
