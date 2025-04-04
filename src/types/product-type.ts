
type Brand = {
  name: string;
  id: string;
}

type Category = {
  name: string;
  id: string;
}

type Color = {
  name: string;
  clrCode: string;
}

type ImageURL = {
  color?: Color;
  img: string;
}

type AdditionalInformation = {
  key: string;
  value: string;
}
type IReviewUser = {
  _id:string;
  name:string;
  email:string;
}
type TReview = {
  _id: string;
  userId: IReviewUser;
  productId: string;
  rating: number;
  comment: string;
  updatedAt: string;
  createdAt: string;
}


export interface IProduct {
  _id: string;
  brand: Brand;
  category: Category;
  sku: string;
  img: string;
  title: string;
  slug?: string;
  unit?: string;
  imageURLs: ImageURL[];
  parent: string;
  children: string;
  price: number;
  discount?: number;
  quantity: number;
  status: 'in-stock' | 'out-of-stock' | 'discontinued';
  reviews?: TReview[];
  productType: string;
  description: string;
  additionalInformation?: AdditionalInformation[];
  offerDate?: {
    startDate: string,
    endDate: string,
  }
  featured?: boolean;
  sellCount?: number;
  sizes?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  orderQuantity: number;
}

export interface ProductResponse {
  success: boolean;
  data: IProduct[];
}

// IAddProduct
export interface IAddProduct {
  sku: string;
  img: string;
  title: string;
  slug?: string;
  unit: string;
  imageURLs: {
    color: {
      name?: string;
      clrCode?: string;
    };
    img: string;
    sizes?: string[];
  }[];
  parent: string;
  children: string;
  price: number;
  discount: number;
  quantity: number;
  brand: { name: string, id: string };
  category: { name: string, id: string };
  status: 'in-stock' | 'out-of-stock' | 'discontinued';
  productType: string;
  description: string;
  videoId?: string;
  additionalInformation?: {
    key: string;
    value: string;
  }[];
  tags?: string[];
  sizes?: string[];
  offerDate?: {
    startDate: string | null,
    endDate: string | null
  },
}

// review product response 
export interface IReviewProductRes {
  success:boolean;
  data:IProduct[]
}
// delete review product response 
export interface IDelReviewsRes {
  success:boolean;
  message:string;
}