import { TransformStream } from 'node:stream/web'
import { encodeUTF8, LineDecoder } from './decoders/line'
import type { ServerSentEvent } from './decoders/sse'
import { SSEDecoder } from './decoders/sse'

function transformOpenAISSE(event: ServerSentEvent) {
  if (event.data === '[DONE]') {
    return {
      message: {},
      done: true,
    }
  }
  const data = JSON.parse(event.data)
  return {
    model: data.model,
    created_at: data.created,
    message: data.choices[0].delta,
    done: false,
  }
}

function transformOpenAIStreamLine(
  line: string,
  decoder: SSEDecoder,
  controller: TransformStreamDefaultController<any>,
) {
  const sse = decoder.decode(line)
  if (sse) {
    const chunk = transformOpenAISSE(sse)
    controller.enqueue(encodeUTF8(JSON.stringify(chunk) + '\n'))
  }
}

export class OpenAIOllamaStream extends TransformStream {
  constructor() {
    const sseDecoder = new SSEDecoder()
    const lineDecoder = new LineDecoder()
    super({
      transform(chunk, controller) {
        for (const line of lineDecoder.decode(chunk)) {
          transformOpenAIStreamLine(line, sseDecoder, controller)
        }
      },
      flush(controller) {
        for (const line of lineDecoder.flush()) {
          transformOpenAIStreamLine(line, sseDecoder, controller)
        }
      },
    })
  }
}
