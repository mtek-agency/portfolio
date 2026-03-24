export function useProjectExportImport() {
  const toast = useAppToast()
  const importInput = ref<HTMLInputElement>()

  async function exportProjects() {
    const blob = await $fetch<Blob>('/api/projects/export', { responseType: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projects_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImportFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await $fetch<{ imported: number, skipped: number }>('/api/projects/import', {
        method: 'POST',
        body: formData,
      })
      await refreshNuxtData('projects')
      const s = (n: number) => n !== 1 ? 's' : ''
      toast.success(
        'Import terminé',
        `${result.imported} projet${s(result.imported)} importé${s(result.imported)}${result.skipped ? `, ${result.skipped} ignoré${s(result.skipped)}` : ''}`,
      )
    }
    catch {
      toast.error('Erreur import', 'Fichier CSV invalide ou corrompu')
    }
    finally {
      if (importInput.value) importInput.value.value = ''
    }
  }

  return { importInput, exportProjects, onImportFile }
}
