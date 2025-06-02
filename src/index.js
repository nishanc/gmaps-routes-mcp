
import { WorkerEntrypoint } from 'cloudflare:workers'
import { ProxyToSelf } from 'workers-mcp'

export default class MyWorker extends WorkerEntrypoint {
  /**
   * A warm, friendly greeting from your new Workers MCP server.
   * @param name {string} the name of the person we are greeting.
   * @return {string} the contents of our greeting.
   */
  sayHello(name) {
    return `Hello from an MCP Worker, ${name}!`
  }

  /**
   * @ignore
   **/
  async fetch(request) {
    return new ProxyToSelf(this).fetch(request)
  }
}
