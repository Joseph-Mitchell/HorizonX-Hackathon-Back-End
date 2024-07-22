export const existingRoles = [
    {
        _id: "669e6af4240de0b241684274",
        role_name: "user",
        admin_permissions: false,
    },
    {
        _id: "669e6b24240de0b241684275",
        role_name: "admin",
        admin_permissions: true,
    }
];

export const existingAccounts = [
    {
        _id: "669e97afce335ad0bcab29b6",
        username: "adminUser",
        password: "testPass",
        role: "669e6b24240de0b241684275",
    },
    {
        _id: "669e97bbec8a455f3a659599",
        username: "normalUser",
        password: "testPass",
        role: "669e6af4240de0b241684274",
    },
];

export const testLogins = {
    normal: {
        username: "adminUser",
        password: "testPass",
    },
    noUser: {
        username: "wrongUser",
        password: "testPass",
    },
    wrongPass: {
        username: "adminUser",
        password: "wrongPass",
    }
}