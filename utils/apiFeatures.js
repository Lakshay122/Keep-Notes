class ApiFeatures{
    constructor(query,quertStr){
        this.query=query;
        this.quertStr=quertStr;
    }
    search(){
        console.log(this.quertStr)
        const keyword=this.quertStr.keyword ?
         {
            name:{
                $regex:this.quertStr.keyword,
                $options:"i",
            },

        }
        :{};
         console.log(keyword);
        this.query=this.query.find({...keyword});
    
        return this;

    }
    filter(){
        const queryCopy= {...this.quertStr};
        //removing the foelds from the params
        const removeFields=["keyword","page","limit"];

        removeFields.forEach(key=>delete queryCopy[key]);
         
       
        let querystr=JSON.stringify(queryCopy);
        querystr=querystr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);
      
        this.query=this.query.find(JSON.parse(querystr));
        return this;
    }
    pagination(resultPerPage){
        const currentPage=Number(this.quertStr.page) || 1;

        const skip=(currentPage-1)*resultPerPage;
       
        this.query=this.query.limit(resultPerPage).skip(skip);

        return this;

    }
}

module.exports= ApiFeatures;