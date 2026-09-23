"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const searchService_1 = require("../services/searchService");
let searchService;
const getSearchService = () => {
    if (!searchService) {
        searchService = new searchService_1.SearchService();
    }
    return searchService;
};
class SearchController {
    async searchById(req, res) {
        try {
            const { id } = req.params;
            const service = getSearchService();
            const results = await service.searchByObjectId(id);
            res.status(200).json({ success: true, data: results });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.SearchController = SearchController;
//# sourceMappingURL=searchController.js.map