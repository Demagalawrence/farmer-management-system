import { ObjectId } from 'mongodb';
export interface SearchResults {
    users: any[];
    farmers: any[];
    fields: any[];
    harvests: any[];
    payments: any[];
    reports: any[];
}
export declare class SearchService {
    private db;
    constructor();
    searchByObjectId(id: string | ObjectId): Promise<SearchResults>;
}
//# sourceMappingURL=searchService.d.ts.map