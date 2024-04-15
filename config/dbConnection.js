import mongoose from "mongoose";

//Strict mode m yeh hota h ki agr kuch glt send kia toh phat jaega
//yha yeh ignore kr dega

mongoose.set('strictQuery',false);

const connectionToDB = async () => {
    
    try{
        const { connection } = await mongoose.connect(
            process.env.MONGO_URI ||  `mongodb://127.0.0.1:27017/lms`
    
        );
    
        if(connection){
            console.log(`Connected to MongoDB:${connection.host}`);
        }
    }catch(e){
        console.log(e);
        process.exit(1);
    }

    


}

export default connectionToDB;


