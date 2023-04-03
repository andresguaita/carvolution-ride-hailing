
export interface SeedData {
    riders: User[];
    drivers: User[]
    paymentMethods: PaymentMethod[]
}

interface User {
    email: string;
    password: string;
    names: string;
    lastNames: string;
}

interface PaymentMethod {
    id: number;
    methodToken: string;
    type: string;
}


export const initialData: SeedData = {
    riders: [{
        email: 'jaimealberto@example.com',
        password: 'Password#1234',
        names: 'Jaime Alberto',
        lastNames: 'Gomez Arbelaez',
    },
],
    drivers: [{
        email: 'pedroperez@example.com',
        password: 'Password#1234',
        names: 'Pedro',
        lastNames: 'Perez'
    },
    {
        email: 'baudiliodiaz@example.com',
        password: 'Password#1234',
        names: 'Baudilio',
        lastNames: 'Diaz'
    },
    {
        email: 'federizoperez@example.com',
        password: 'Password#1234',
        names: 'Federico',
        lastNames: 'Perez'
    },
    {
        email: 'antoniogutierres@example.com',
        password: 'Password#1234',
        names: 'Antonio',
        lastNames: 'Gutierres'
    }],

    paymentMethods: [
        {

            id: 51603,
            methodToken: 'tok_test_39862_6d1e7c30c90f0d9bf0A0a54E1CEf781a',
            type: 'CARD'
        }
    ]

}

