import mongoose = require("mongoose")

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect('mongodb+srv://usuario_db_1:keadkeb3r5Tr3z9N@cluster-usuario.jylct.mongodb.net/test?authSource=admin&replicaSet=atlas-czioze-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', 
      {
        //useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false,
      }),
      
  },
  
]