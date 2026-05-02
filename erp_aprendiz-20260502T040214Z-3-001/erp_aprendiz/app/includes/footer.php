    </div><!-- .page-content -->
</div><!-- .main-content -->

<script>
// Mobile sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
    // Auto-open nav groups with active children
    document.querySelectorAll('.nav-item.active').forEach(item => {
        const group = item.closest('.nav-group');
        if (group) group.classList.add('open');
    });
});

// Confirm delete
function confirmDelete(url, name) {
    if (confirm('Tem certeza que deseja excluir "' + name + '"?\nEsta ação não pode ser desfeita.')) {
        window.location.href = url;
    }
}
</script>
</body>
</html>
