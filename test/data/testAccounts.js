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

export const existingAccounts = {
    admin: {
        username: "adminUser",
        password: "testPass",
        role: "669e6b24240de0b241684275",
    },
    user: {
        username: "normalUser",
        password: "testPass",
        role: "669e6af4240de0b241684274",
    },
}