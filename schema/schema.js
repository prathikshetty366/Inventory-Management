const graphql = require("graphql")
const Product=require("../models/products");
const Disease =require("../models/diseases");
const { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;//grab this object from graphql

const DiseaseType = new GraphQLObjectType({
    name: "Disease",
    fields: () => ({
        id: { type: GraphQLID },
        diseaseName: { type: GraphQLString },
        productId:{type:GraphQLString},
        product: {
            type: ProductType,
            resolve(parent, args) {
                console.log(parent);
                return Product.findById(parent.productId)
            }
        }
    }) //wrapping all the fileds in ES6 functions
})

const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        price: { type: GraphQLInt },
        count: { type: GraphQLInt },
        disease: {
            type: new GraphQLList(DiseaseType),
            resolve(parent, args) {
                return Disease.find({ productId: parent.id })
            }
        }
    })
})

//root query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        disease: {               
            type: DiseaseType,
            args: { id: { type: GraphQLID } }, //to fetch particular data we need to pass arguments, (IN-REST-->endpoint/Books:id)
            resolve(parent, args) {
                //code to get data from db or other source
                return Disease.findById(args.id);
            }
        },
        //author API
        product: {
            type: ProductType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Product.findById(args.id)
            }
        },
        //All books API
        diseases: {
            type: new GraphQLList(DiseaseType),
            resolve(parent, args) {
                return Disease.find({})
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                return Product.find({})
            }
        }
    }
})

//mutation
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addProduct: {
            type: ProductType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLInt) },
                count: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let product = new Product({
                    title: args.title,
                    price: args.price,
                    count: args.count
                });
                return product.save()
            }
        },
        addDisease: {
            type: DiseaseType,
            args: {
                diseaseName: { type: new GraphQLNonNull(GraphQLString) },
                productId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let disease = new Disease({
                    diseaseName: args.diseaseName,
                    productId: args.productId
                });
                return disease.save()
            }
        },
        updateProduct: {
            type: ProductType,
            args: {
                 id: { type: GraphQLID },
                count: { type: GraphQLInt },
                price: { type: GraphQLInt },
                title: { type: GraphQLString },
            },
            resolve(parentValue, args){
                return new Promise((resolve, reject) => {
                    Product.findOneAndUpdate(
                        {"_id": args.id},
                        { "$set":{count:args.count,price:args.price,title:args.title}},
                        {"new": true} //returns new document
                    ).exec((err, res) => {
                        if(err) reject(err)
                        else resolve(res)
                    })
                })
            }
        }
    }
})

//export the module
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})