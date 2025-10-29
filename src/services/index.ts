import { PolymarketService } from './polymarket';
import { AgentService } from './agent';

class ServiceManager {
  private static instance: ServiceManager;
  private polymarketService: PolymarketService;
  private agentService: AgentService;

  private constructor() {
    this.polymarketService = new PolymarketService();
    this.agentService = new AgentService();
  }

  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  getPolymarketService(): PolymarketService {
    return this.polymarketService;
  }

  getAgentService(): AgentService {
    return this.agentService;
  }
}

export default ServiceManager;
export { PolymarketService, AgentService };