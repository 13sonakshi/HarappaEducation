class Pagination {
    build(req) {
        let page = 1;
        if(req.query.page && Number(req.query.page) >= 1) {
            page = Number(req.query.page);
        }
        let records_per_page = 10;
        if(req.query.records_per_page) {
            records_per_page = Number(req.query.records_per_page);
        }

        return { offset: ( ( page * records_per_page ) - records_per_page ), limit: records_per_page };
    }
} 

module.exports = new Pagination;