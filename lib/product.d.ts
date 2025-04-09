interface CollectionPType {
    id: string; // Unique identifier for the collection
    title: string; // Title of the collection
  }
  
  interface ProductType {
    id: string; // Unique identifier for the product
    userId: string; // ID of the user who created the product
    title: string; // Title of the product
    description: string; // Description of the product
    price: number; // Price of the product
    pay: number; // Payment amount for the product
    media: string[]; // Array of media URLs (images/videos) for the product
    category: string; // Category of the product
    collection?: CollectionPType; // Optional collection the product belongs to
    brand: string; // Brand of the product
    colors: string[]; // Array of colors for the product
    tags: string[]; // Array of tags for the product
    sizes: string[]; // Array of sizes for the product
    collectionId: string | null; // Optional collection ID the product belongs to
    createdAt: Date; // Timestamp when the product was created
    updatedAt: Date; // Timestamp when the product was last updated
  }