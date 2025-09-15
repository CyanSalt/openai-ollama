import type { EventSourceMessage } from 'eventsource-parser'

export class OpenAIOllamaStream extends TransformStream<EventSourceMessage, {
  model?: string,
  created_at?: number,
  message: unknown,
  done: boolean,
}> {
  constructor() {
    super({
      transform(chunk, controller) {
        if (chunk.data === '[DONE]') {
          controller.enqueue({
            message: {},
            done: true,
          })
        } else {
          const data = JSON.parse(chunk.data)
          controller.enqueue({
            model: data.model,
            created_at: data.created,
            message: data.choices[0].delta,
            done: false,
          })
        }
      },
    })
  }
}

export class JSONLineStream extends TransformStream<unknown, string> {
  constructor() {
    super({
      transform(chunk, controller) {
        controller.enqueue(JSON.stringify(chunk) + '\n')
      },
    })
  }
}
