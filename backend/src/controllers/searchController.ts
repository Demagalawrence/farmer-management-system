import { Request, Response } from 'express';
import { SearchService } from '../services/searchService';

let searchService: SearchService;
const getSearchService = (): SearchService => {
  if (!searchService) {
    searchService = new SearchService();
  }
  return searchService;
};

export class SearchController {
  async searchById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const service = getSearchService();
      const results = await service.searchByObjectId(id);
      res.status(200).json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
