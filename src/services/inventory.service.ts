import { InventoryDTO } from '../types/inventory.type';
import { InventoryModel } from '../models/inventory.model';

export class InventoryService {
  constructor(private inventoryModel: InventoryModel) {}

  getInventory() {
    return this.inventoryModel.getInventory();
  }

  getBatchDetails(produkId: string) { // Changed to match controller and model
    return this.inventoryModel.getBatchDetails(produkId);
  }

  createBatch(batchData: InventoryDTO) {
    return this.inventoryModel.createBatch(batchData);
  }

  updateBatch(produkId: string, batchData: Partial<InventoryDTO>) { // Changed to match controller and model
    return this.inventoryModel.updateBatch(produkId, batchData);
  }

  deleteBatch(produkId: string) { // Changed to match controller and model
    return this.inventoryModel.deleteBatch(produkId);
  }
}