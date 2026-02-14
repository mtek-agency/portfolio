import type { Project, ProjectInsert } from '~~/server/db/schema'

class ExportService {
    /**
     * Échappe les valeurs pour le format CSV
     */
    private escapeCsvValue(value: any): string {
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
    }

    /**
     * Parse une ligne CSV en tenant compte des guillemets
     */
    private parseCsvLine(line: string): string[] {
        const result: string[] = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
            const char = line[i]
            const nextChar = line[i + 1]

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"'
                    i++
                } else {
                    inQuotes = !inQuotes
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim())
                current = ''
            } else {
                current += char
            }
        }

        result.push(current.trim())
        return result
    }

    /**
     * Exporte des projets en CSV
     */
    exportProjects(projects: Project[]): string {
        const headers = [
            'id',
            'name',
            'description',
            'urlWebsite',
            'urlRepository',
            'year',
            'tags',
            'slug',
            'stack',
            'isDisabled',
            'createdAt',
            'updatedAt'
        ]

        const csvRows = [
            headers.join(','),
            ...projects.map(project =>
                headers.map(header =>
                    this.escapeCsvValue(project[header as keyof Project])
                ).join(',')
            )
        ]

        return csvRows.join('\n')
    }

    /**
     * Parse un CSV et retourne les données des projets
     */
    parseProjectsCsv(csvContent: string): Partial<ProjectInsert>[] {
        const lines = csvContent.split('\n').filter(line => line.trim())

        if (lines.length < 2) {
            throw new Error('CSV file is empty or invalid')
        }

        const headers = this.parseCsvLine(lines[0])
        const projects: Partial<ProjectInsert>[] = []

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCsvLine(lines[i])
            const projectData: any = {}

            headers.forEach((header, index) => {
                projectData[header] = values[index] || null
            })

            // Convertir les données au bon format
            const project: Partial<ProjectInsert> = {
                name: projectData.name || undefined,
                description: projectData.description || undefined,
                urlWebsite: projectData.urlWebsite || undefined,
                urlRepository: projectData.urlRepository || undefined,
                year: projectData.year || undefined,
                tags: projectData.tags || undefined,
                slug: projectData.slug || undefined,
                stack: projectData.stack || undefined,
                isDisabled: projectData.isDisabled === 'true' || projectData.isDisabled === '1'
            }

            projects.push(project)
        }

        return projects
    }

    /**
     * Génère un nom de fichier avec timestamp
     */
    generateFilename(prefix: string = 'export'): string {
        const date = new Date().toISOString().split('T')[0]
        return `${prefix}_${date}.csv`
    }
}

export const exportService = new ExportService()