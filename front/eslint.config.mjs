// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    // ...Custom flat configs append after nuxt's configs
)
    .prepend(
        // Les fichiers Markdown (README, docs) ne sont pas du code à analyser.
        { ignores: ['**/*.md'] },
    )
    // Override some rules in a specific config, based on their name
    .override('nuxt/typescript/rules', {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off'
        }
    })