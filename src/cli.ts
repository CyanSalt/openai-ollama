#!/usr/bin/env node
import path from 'node:path'
import { consola } from 'consola'
import { colors } from 'consola/utils'
import mri from 'mri'
import type { BackendOptions, ServerOptions } from '.'
import { prepare, serve } from '.'

export interface CLIOptions extends Partial<Pick<ServerOptions, 'port'>> {
  'config-file'?: string,
}

export type Config = Partial<BackendOptions> & Partial<ServerOptions>

async function resolveConfig(options: CLIOptions) {
  const configFile = options['config-file']
  if (configFile) {
    const { default: config } = await import(
      path.resolve(configFile),
      { with: { type: 'json' } }
    ) as { default: Config }
    return config
  }
  return {}
}

function toNumber(value: string | undefined) {
  if (typeof value === 'string') {
    const number = Number(value)
    return isNaN(number) ? undefined : number
  }
  return undefined
}

async function main() {
  const argv = process.argv.slice(2)
  const args = mri<CLIOptions>(argv)
  const config = await resolveConfig(args)

  const apiKey = config.apiKey ?? process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Missing API Key. Make sure you have the `OPENAI_API_KEY` environment variable, or the `apiKey` property in the file specified by `--config-file`.')
  }
  const backend = prepare({
    apiKey,
    baseURL: config.baseURL ?? process.env.OPENAI_BASE_URL,
    models: config.models,
  })

  const port = args.port ?? config.port ?? toNumber(process.env.PORT) ?? 11434
  await serve(backend, {
    port,
  })
  consola.box(`Local Ollama server is running on

${colors.green(`http://localhost:${port}`)}`)
}

try {
  await main()
} catch (err) {
  consola.error(err)
  if (!process.exitCode) {
    process.exitCode = 1
  }
}
