const API_URL = 'https://ea788-service-34150958-cdb3f328.us.monday.app';

const fragrances = [
    {
        "name": "Citrus",
        "category": "citrus",
        "description": "a nice citrus scent",
        "image_url": ""
    },
    {
        "name": "Floral",
        "category": "floral",
        "description": "a nice floral scent",
        "image_url": ""
    },
    {
        "name": "Fresh",
        "category": "fresh",
        "description": "a nice fresh scent",
        "image_url": ""
    },
    {
        "name": "Fruity",
        "category": "fruity",
        "description": "a nice fruity scent",
        "image_url": ""
    },
    {
        "name": "Herbaceous",
        "category": "herbaceous",
        "description": "a nice herbaceous scent",
        "image_url": ""
    },
    {
        "name": "Smokey",
        "category": "smokey",
        "description": "a nice smokey scent",
        "image_url": ""
    },
    {
        "name": "Woody",
        "category": "woody",
        "description": "a nice woody scent",
        "image_url": ""
    }
];

async function seed() {
    // delete all fragrances
    const existing = await fetch(`${API_URL}/api/fragrances`);
    const fragrances_to_delete = await existing.json();
    
    for (const fragrance of fragrances_to_delete) {
        await fetch(`${API_URL}/api/fragrances/${fragrance.id}`, {
        method: 'DELETE'
        });
        console.log('Deleted:', fragrance.name);
    }

    // create all fragrances
    for (const fragrance of fragrances) {
        const res = await fetch(`${API_URL}/api/fragrances`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fragrance)
        });
        const data = await res.json();
        console.log('Created:', data.name);
    }
    console.log('Done!');
}

seed();