# openai-ollama

[![npm](https://img.shields.io/npm/v/openai-ollama.svg)](https://www.npmjs.com/package/openai-ollama)

Create a local Ollama proxy service for the OpenAI compatible backend. This allows you to integrate your OpenAI backend in BYOK mode as an Ollama backend with other applications, such as VSCode GitHub Copilot.

## Usage

```shell
pnpm i -g openai-ollama

openai-ollama
```

Or just

```shell
pnpm dlx openai-ollama
```

### Configuration

The recommended way is to configure OpenAI compatible backend and server via configuration files.

```json
{
  "baseURL": "<YOUR_BASE_URL>",
  "apiKey": "<YOUR_API_KEY>",
  "models": [
    {
      "id": "<MODEL_ID>",
      "name": "<MODEL_NAME>"
    }
  ]
}
```

Then just pass the file argument to the CLI:

```shell
openai-ollama --config-file=/path/to/config.json
```

Alternatively, you can configure **most** options through environment variables, or configure **a few** options through command line arguments. When used this way, command line arguments have a higher priority than configuration files, while environment variables always have the lowest priority.

Supported options are as follows:

- `apiKey`: (Required) API key for OpenAI compatible backends. Defaults to `OPENAI_API_KEY` environment variable.
- `baseURL`: Base URL for OpenAI compatible backends. Defaults to `OPENAI_BASE_URL` environment variable or `https://api.openai.com/v1`
- `models`: Specifies the list of available models. The list of models will be obtained through the OpenAI compatible API (`/models`) if not specified, which is not supported by some backends.
  - Elements in `models` are objects with the following properties, or the `id` property of the object.
    - `id`: Unique ID of the model.
    - `name`: Display name of the model.
- `port` or `--port`: The port the server listens on. Defaults to `PORT` environment variable or `11434`.
