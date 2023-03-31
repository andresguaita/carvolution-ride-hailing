
export interface SeedData {
    users: User[];
    paymentMethods: PaymentMethod[]
}

interface User{
    email:string;
    password:string;
}

interface PaymentMethod  {
    id:number;
    methodToken: string;
    type:string;
}


export const initialData: SeedData = {
    users:[{
        email: 'jaimealberto@example.com',
        password : 'Password#1234',
    }],
    paymentMethods: [
        {
            
            id:51603,
            methodToken: 'tok_test_39862_6d1e7c30c90f0d9bf0A0a54E1CEf781a',
            type: 'CARD'
        }
    ]

}

