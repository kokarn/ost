import {writeFile} from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import got from 'got';
import * as cheerio from 'cheerio';

import parseWikiTable from './modules/parse-wiki-table.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const weirdStores = [
    // 'https://oldschool.runescape.wiki/w/Bandit_Duty_Free',
    // "https://oldschool.runescape.wiki/w/TzHaar-Hur-Lek%27s_Ore_and_Gem_Store",
    // "https://oldschool.runescape.wiki/w/TzHaar-Hur-Rin%27s_Ore_and_Gem_Store",
    // 'https://oldschool.runescape.wiki/w/TzHaar-Mej-Roh%27s_Rune_Store',
    // "https://oldschool.runescape.wiki/w/TzHaar-Hur-Rin%27s_Ore_and_Gem_Store",
    // "https://oldschool.runescape.wiki/w/TzHaar-Hur-Zal%27s_Equipment_Store",
    // "https://oldschool.runescape.wiki/w/TzHaar-Hur-Tel%27s_Equipment_Store",
    // "https://oldschool.runescape.wiki/w/Mythical_Cape_Store",
    // "https://oldschool.runescape.wiki/w/Aggie",
    // "https://oldschool.runescape.wiki/w/Ali_the_dyer",
    // "https://oldschool.runescape.wiki/w/Mairin%27s_Market",
    // "https://oldschool.runescape.wiki/w/Zahur",
    // "https://oldschool.runescape.wiki/w/Ali_the_Kebab_seller",
    // "https://oldschool.runescape.wiki/w/Kjut%27s_Kebabs",
    // "https://oldschool.runescape.wiki/w/Karim",
    // "https://oldschool.runescape.wiki/w/Silk_trader",
    // "https://oldschool.runescape.wiki/w/Silk_merchant",
    // "https://oldschool.runescape.wiki/w/Anwen",
    // 'https://oldschool.runescape.wiki/w/Candle_seller',
    // "https://oldschool.runescape.wiki/w/Baraek",
];

let stores = [
    'https://oldschool.runescape.wiki/w/Brian%27s_Archery_Supplies.',
    'https://oldschool.runescape.wiki/w/Lowe%27s_Archery_Emporium',
    'https://oldschool.runescape.wiki/w/Aaron%27s_Archery_Appendages.',
    'https://oldschool.runescape.wiki/w/Dargaud%27s_Bow_and_Arrows.',
    'https://oldschool.runescape.wiki/w/Daryl%27s_Ranging_Surplus',
    'https://oldschool.runescape.wiki/w/Hickton%27s_Archery_Emporium.',
    'https://oldschool.runescape.wiki/w/Lletya_Archery_Shop',
    'https://oldschool.runescape.wiki/w/Oobapohk%27s_Javelin_Store',
    'https://oldschool.runescape.wiki/w/Sian%27s_Ranged_Weaponry',
    'https://oldschool.runescape.wiki/w/Void_Knight_Archery_Store',
    'https://oldschool.runescape.wiki/w/Dommik%27s_Crafting_Store',
    'https://oldschool.runescape.wiki/w/Rommik%27s_Crafty_Supplies',
    'https://oldschool.runescape.wiki/w/Carefree_Crafting_Stall',
    'https://oldschool.runescape.wiki/w/Hamab%27s_Crafting_Emporium',
    'https://oldschool.runescape.wiki/w/Jamila%27s_Craft_Stall',
    'https://oldschool.runescape.wiki/w/Neitiznot_Supplies',
    'https://oldschool.runescape.wiki/w/Prifddinas%27_Seamstress',
    'https://oldschool.runescape.wiki/w/Raetul_and_Co%27s_Cloth_Store.',
    'https://oldschool.runescape.wiki/w/Pie_Shop',
    'https://oldschool.runescape.wiki/w/Grand_Tree_Groceries',
    'https://oldschool.runescape.wiki/w/Funch%27s_Fine_Groceries',
    'https://oldschool.runescape.wiki/w/Funch%27s_Fine_Groceries',
    'https://oldschool.runescape.wiki/w/Frenita%27s_Cookery_Shop.',
    'https://oldschool.runescape.wiki/w/Aemad%27s_Adventuring_Supplies.',
    'https://oldschool.runescape.wiki/w/Al_Kharid_General_Store',
    'https://oldschool.runescape.wiki/w/Arhein_Store',
    'https://oldschool.runescape.wiki/w/Arnold%27s_Eclectic_Supplies.',
    'https://oldschool.runescape.wiki/w/Aurel%27s_Supplies',
    'https://oldschool.runescape.wiki/w/Bolkoy%27s_Village_Shop',
    'https://oldschool.runescape.wiki/w/Burthorpe_Supplies',
    'https://oldschool.runescape.wiki/w/Dal%27s_General_Ogre_Supplies',
    'https://oldschool.runescape.wiki/w/Darkmeyer_General_Store',
    'https://oldschool.runescape.wiki/w/Dorgesh-Kaan_General_Supplies',
    'https://oldschool.runescape.wiki/w/Dwarven_shopping_store',
    'https://oldschool.runescape.wiki/w/Edgeville_General_Store',
    'https://oldschool.runescape.wiki/w/Falador_General_Store',
    'https://oldschool.runescape.wiki/w/Fossil_Island_General_Store',
    'https://oldschool.runescape.wiki/w/General_Store_(Canifis)',
    'https://oldschool.runescape.wiki/w/Gunslik%27s_Assorted_Items',
    'https://oldschool.runescape.wiki/w/Ifaba%27s_General_Store',
    'https://oldschool.runescape.wiki/w/Jennifer%27s_General_Supplies',
    'https://oldschool.runescape.wiki/w/Jiminua%27s_Jungle_Store.',
    'https://oldschool.runescape.wiki/w/Karamja_General_Store',
    'https://oldschool.runescape.wiki/w/Khazard_General_Store',
    'https://oldschool.runescape.wiki/w/Leenz%27s_General_Supplies',
    'https://oldschool.runescape.wiki/w/Legends_Guild_General_Store.',
    'https://oldschool.runescape.wiki/w/Little_Munty%27s_Little_Shop',
    'https://oldschool.runescape.wiki/w/Little_Shop_of_Horace',
    'https://oldschool.runescape.wiki/w/Lletya_General_Store',
    'https://oldschool.runescape.wiki/w/Lumbridge_General_Store',
    'https://oldschool.runescape.wiki/w/Martin_Thwait%27s_Lost_and_Found.',
    'https://oldschool.runescape.wiki/w/Miscellanian_General_Store',
    'https://oldschool.runescape.wiki/w/Moon_Clan_General_Store.',
    'https://oldschool.runescape.wiki/w/Nardah_General_Store.',
    'https://oldschool.runescape.wiki/w/Obli%27s_General_Store.',
    'https://oldschool.runescape.wiki/w/Pollnivneach_general_store.',
    'https://oldschool.runescape.wiki/w/Port_Phasmatys_General_Store',
    'https://oldschool.runescape.wiki/w/Prifddinas_General_Store',
    'https://oldschool.runescape.wiki/w/Quartermaster%27s_Stores',
    'https://oldschool.runescape.wiki/w/Rasolo_the_Wandering_Merchant',
    'https://oldschool.runescape.wiki/w/Razmire_General_Store.',
    'https://oldschool.runescape.wiki/w/Regath%27s_Wares',
    'https://oldschool.runescape.wiki/w/Rimmington_General_Store',
    'https://oldschool.runescape.wiki/w/Sigmund_the_Merchant_(shop)',
    'https://oldschool.runescape.wiki/w/The_Lighthouse_Store',
    'https://oldschool.runescape.wiki/w/Trader_Stan%27s_Trading_Post',
    'https://oldschool.runescape.wiki/w/Varrock_General_Store',
    'https://oldschool.runescape.wiki/w/Void_Knight_General_Store',
    'https://oldschool.runescape.wiki/w/Warrens_General_Store',
    'https://oldschool.runescape.wiki/w/West_Ardougne_General_Store',
    'https://oldschool.runescape.wiki/w/Zanaris_General_Store',
    'https://oldschool.runescape.wiki/w/Aubury%27s_Rune_Shop',
    'https://oldschool.runescape.wiki/w/Betty%27s_Magic_Emporium',
    'https://oldschool.runescape.wiki/w/Ali%27s_Discount_Wares.',
    'https://oldschool.runescape.wiki/w/Amlodd%27s_Magical_Supplies',
    'https://oldschool.runescape.wiki/w/Baba_Yaga%27s_Magic_Shop',
    'https://oldschool.runescape.wiki/w/Battle_Runes',
    'https://oldschool.runescape.wiki/w/Lundail%27s_Arena-side_Rune_Shop',
    'https://oldschool.runescape.wiki/w/Magic_Guild_Store_(Runes_and_Staves)',
    'https://oldschool.runescape.wiki/w/Regath%27s_Wares',
    'https://oldschool.runescape.wiki/w/Thyria%27s_Wares',
    'https://oldschool.runescape.wiki/w/Tutab%27s_Magical_Market',
    'https://oldschool.runescape.wiki/w/Void_Knight_Magic_Store',
    'https://oldschool.runescape.wiki/w/Davon%27s_Amulet_Store.',
    'https://oldschool.runescape.wiki/w/Bob%27s_Brilliant_Axes',
    'https://oldschool.runescape.wiki/w/Brian%27s_Battleaxe_Bazaar',
    'https://oldschool.runescape.wiki/w/Mount_Karuulm_Weapon_Shop',
    'https://oldschool.runescape.wiki/w/Perry%27s_Chop-chop_Shop',
    'https://oldschool.runescape.wiki/w/Warrior_Guild_Armoury',
    'https://oldschool.runescape.wiki/w/Candle_Shop',
    'https://oldschool.runescape.wiki/w/Darkmeyer_Lantern_Shop',
    'https://oldschool.runescape.wiki/w/Miltog%27s_Lamps',
    'https://oldschool.runescape.wiki/w/Wayne%27s_Chains!_-_Chainmail_specialist.',
    'https://oldschool.runescape.wiki/w/Blair%27s_Armour',
    'https://oldschool.runescape.wiki/w/Thessalia%27s_Fine_Clothes',
    "https://oldschool.runescape.wiki/w/Agmundi_Quality_Clothes",
    "https://oldschool.runescape.wiki/w/Barker%27s_Haberdashery",
    "https://oldschool.runescape.wiki/w/Darkmeyer_Seamstress",
    "https://oldschool.runescape.wiki/w/Dodgy_Mike%27s_Second_Hand_Clothing.",
    "https://oldschool.runescape.wiki/w/Fancy_Clothes_Store",
    "https://oldschool.runescape.wiki/w/Fine_Fashions",
    "https://oldschool.runescape.wiki/w/Grace%27s_Graceful_Clothing",
    "https://oldschool.runescape.wiki/w/Lletya_Seamstress",
    "https://oldschool.runescape.wiki/w/Lliann%27s_Wares",
    "https://oldschool.runescape.wiki/w/Miscellanian_Clothes_Shop",
    "https://oldschool.runescape.wiki/w/Moon_Clan_Fine_Clothes.",
    "https://oldschool.runescape.wiki/w/Shayzien_Styles",
    "https://oldschool.runescape.wiki/w/Vermundi%27s_Clothes_Stall",
    "https://oldschool.runescape.wiki/w/Yrsa%27s_Accoutrements",
    "https://oldschool.runescape.wiki/w/Pie_Shop",
    "https://oldschool.runescape.wiki/w/Grand_Tree_Groceries",
    "https://oldschool.runescape.wiki/w/Funch%27s_Fine_Groceries",
    "https://oldschool.runescape.wiki/w/Frenita%27s_Cookery_Shop",
    "https://oldschool.runescape.wiki/w/Dommik%27s_Crafting_Store.",
    "https://oldschool.runescape.wiki/w/Rommik%27s_Crafty_Supplies",
    "https://oldschool.runescape.wiki/w/Carefree_Crafting_Stall",
    "https://oldschool.runescape.wiki/w/Hamab%27s_Crafting_Emporium",
    "https://oldschool.runescape.wiki/w/Jamila%27s_Craft_Stall",
    "https://oldschool.runescape.wiki/w/Neitiznot_Supplies",
    "https://oldschool.runescape.wiki/w/Prifddinas%27_Seamstress",
    "https://oldschool.runescape.wiki/w/Raetul_and_Co%27s_Cloth_Store.",
    "https://oldschool.runescape.wiki/w/Crossbow_Shop_(Keldagrim)",
    "https://oldschool.runescape.wiki/w/Crossbow_Shop_(White_Wolf_Mountain)",
    "https://oldschool.runescape.wiki/w/Crossbow_Shop_(Dwarven_Mine)",
    "https://oldschool.runescape.wiki/w/Betty",
    "https://oldschool.runescape.wiki/w/Guinevere%27s_Dyes",
    "https://oldschool.runescape.wiki/w/Lletya_Seamstress",
    "https://oldschool.runescape.wiki/w/Alice%27s_Farming_shop.",
    "https://oldschool.runescape.wiki/w/Allanna%27s_Farming_Shop",
    "https://oldschool.runescape.wiki/w/Amelia%27s_Seed_Shop",
    "https://oldschool.runescape.wiki/w/Branwen%27s_Farming_Shop",
    "https://oldschool.runescape.wiki/w/Draynor_Seed_Market",
    "https://oldschool.runescape.wiki/w/Leprechaun_Larry%27s_Farming_Supplies.",
    "https://oldschool.runescape.wiki/w/Richard%27s_Farming_shop.",
    "https://oldschool.runescape.wiki/w/Sarah%27s_Farming_shop.",
    "https://oldschool.runescape.wiki/w/Vanessa%27s_Farming_shop.",
    "https://oldschool.runescape.wiki/w/Vannah%27s_Farming_Stall",
    "https://oldschool.runescape.wiki/w/Gerrant%27s_Fishy_Business",
    "https://oldschool.runescape.wiki/w/Etceteria_Fish",
    "https://oldschool.runescape.wiki/w/Fernahei%27s_Fishing_Hut.",
    "https://oldschool.runescape.wiki/w/Fishing_Guild_Shop.",
    "https://oldschool.runescape.wiki/w/Flosi%27s_Fishmongers",
    "https://oldschool.runescape.wiki/w/Fremennik_Fishmonger",
    "https://oldschool.runescape.wiki/w/Harry%27s_Fishing_Shop",
    "https://oldschool.runescape.wiki/w/Ishmael%27s_Fish_He_Sells",
    "https://oldschool.runescape.wiki/w/Island_Fishmonger",
    "https://oldschool.runescape.wiki/w/Lovecraft%27s_Tackle",
    "https://oldschool.runescape.wiki/w/Two_Feet_Charley%27s_Fish_Shop.",
    "https://oldschool.runescape.wiki/w/Tynan%27s_Fishing_Supplies",
    "https://oldschool.runescape.wiki/w/Warrens_Fish_Monger",
    "https://oldschool.runescape.wiki/w/Tony%27s_Pizza_Bases",
    "https://oldschool.runescape.wiki/w/Wydin%27s_Food_Store",
    "https://oldschool.runescape.wiki/w/Pie_Shop",
    "https://oldschool.runescape.wiki/w/Ardougne_Baker%27s_Stall.",
    "https://oldschool.runescape.wiki/w/Darkmeyer_Meat_Shop",
    "https://oldschool.runescape.wiki/w/Frankie%27s_Fishing_Emporium",
    "https://oldschool.runescape.wiki/w/Gianne%27s_Restaurant",
    "https://oldschool.runescape.wiki/w/Keepa_Kettilon%27s_Store",
    "https://oldschool.runescape.wiki/w/Keldagrim%27s_Best_Bread",
    "https://oldschool.runescape.wiki/w/Kenelme%27s_Wares",
    "https://oldschool.runescape.wiki/w/Kourend_Castle_Baker%27s_Stall.",
    "https://oldschool.runescape.wiki/w/Miscellanian_Food_Shop",
    "https://oldschool.runescape.wiki/w/Nathifa%27s_Bake_Stall.",
    "https://oldschool.runescape.wiki/w/Prifddinas_Foodstuffs",
    "https://oldschool.runescape.wiki/w/Rufus%27_Meat_Emporium",
    "https://oldschool.runescape.wiki/w/Solihib%27s_Food_Stall",
    "https://oldschool.runescape.wiki/w/The_Shrimp_and_Parrot",
    "https://oldschool.runescape.wiki/w/Warrior_Guild_Food_Shop",
    "https://oldschool.runescape.wiki/w/Fur_trader_(East_Ardougne)",
    "https://oldschool.runescape.wiki/w/Fur_trader_(Rellekka)",
    "https://oldschool.runescape.wiki/w/Gem_Trader",
    "https://oldschool.runescape.wiki/w/Herquin%27s_Gems",
    "https://oldschool.runescape.wiki/w/Ardougne_Gem_Stall.",
    "https://oldschool.runescape.wiki/w/Green_Gemstone_Gems",
    "https://oldschool.runescape.wiki/w/Kourend_Castle_Gem_Stall",
    "https://oldschool.runescape.wiki/w/Prifddinas_Gem_Stall",
    "https://oldschool.runescape.wiki/w/Helmet_Shop.",
    "https://oldschool.runescape.wiki/w/Skulgrimen%27s_Battle_Gear",
    "https://oldschool.runescape.wiki/w/Frincos%27_Fabulous_Herb_Store",
    "https://oldschool.runescape.wiki/w/Grud%27s_Herblore_Stall",
    "https://oldschool.runescape.wiki/w/Jatix%27s_Herblore_Shop",
    "https://oldschool.runescape.wiki/w/Myths%27_Guild_Herbalist",
    "https://oldschool.runescape.wiki/w/Prifddinas_Herbal_Supplies",
    "https://oldschool.runescape.wiki/w/Aleck%27s_Hunter_Emporium.",
    "https://oldschool.runescape.wiki/w/Nardah_Hunter_Shop",
    "https://oldschool.runescape.wiki/w/Grum%27s_Gold_Exchange.",
    "https://oldschool.runescape.wiki/w/Flynn%27s_Mace_Market.",
    "https://oldschool.runescape.wiki/w/Iwan%27s_Maces",
    "https://oldschool.runescape.wiki/w/Drogo%27s_Mining_Emporium",
    "https://oldschool.runescape.wiki/w/Nurmof%27s_Pickaxe_Shop",
    "https://oldschool.runescape.wiki/w/Yarsul%27s_Prodigious_Pickaxes",
    "https://oldschool.runescape.wiki/w/Gwyn%27s_Mining_Emporium",
    "https://oldschool.runescape.wiki/w/Pickaxe-Is-Mine",
    "https://oldschool.runescape.wiki/w/Thirus_Urkar%27s_Fine_Dynamite_Store",
    "https://oldschool.runescape.wiki/w/Toothy%27s_Pickaxes",
    "https://oldschool.runescape.wiki/w/Horvik%27s_Armour_Shop",
    "https://oldschool.runescape.wiki/w/Aneirin%27s_Armour",
    "https://oldschool.runescape.wiki/w/Armour_Shop_(Jatizso)",
    "https://oldschool.runescape.wiki/w/Myths%27_Guild_Armoury",
    "https://oldschool.runescape.wiki/w/Zenesha%27s_Plate_Mail_Body_Shop",
    "https://oldschool.runescape.wiki/w/Louie%27s_Armoured_Legs_Bazaar.",
    "https://oldschool.runescape.wiki/w/Seddu%27s_Adventurer%27s_Store.",
    "https://oldschool.runescape.wiki/w/Ranael%27s_Super_Skirt_Store.",
    "https://oldschool.runescape.wiki/w/Zeke%27s_Superior_Scimitars",
    "https://oldschool.runescape.wiki/w/Daga%27s_Scimitar_Smithy",
    "https://oldschool.runescape.wiki/w/Smithing_Smith%27s_Shop.",
    "https://oldschool.runescape.wiki/w/Cassie%27s_Shield_Shop.",
    "https://oldschool.runescape.wiki/w/Quality_Armour_Shop",
    "https://oldschool.runescape.wiki/w/Vermundi%27s_Clothes_Stall",
    "https://oldschool.runescape.wiki/w/Ardougne_Silver_Stall.",
    "https://oldschool.runescape.wiki/w/Silver_Cog_Silver_Stall",
    "https://oldschool.runescape.wiki/w/Prifddinas_Silver_Stall",
    "https://oldschool.runescape.wiki/w/Ardougne_Spice_Stall.",
    "https://oldschool.runescape.wiki/w/Prifddinas_Spice_Stall",
    "https://oldschool.runescape.wiki/w/The_Spice_is_Right",
    "https://oldschool.runescape.wiki/w/Zaff%27s_Superior_Staffs!",
    "https://oldschool.runescape.wiki/w/Elgan%27s_Exceptional_Staffs!",
    "https://oldschool.runescape.wiki/w/Filamina%27s_Wares",
    "https://oldschool.runescape.wiki/w/Varrock_Swordshop",
    "https://oldschool.runescape.wiki/w/Armoury",
    "https://oldschool.runescape.wiki/w/Blades_by_Urbi.",
    "https://oldschool.runescape.wiki/w/Briget%27s_Weapons",
    "https://oldschool.runescape.wiki/w/Gaius%27_Two-Handed_Shop",
    "https://oldschool.runescape.wiki/w/Gulluck_and_Sons",
    "https://oldschool.runescape.wiki/w/Iorwerth%27s_Arms",
    "https://oldschool.runescape.wiki/w/Jukat_(shop)",
    "https://oldschool.runescape.wiki/w/Myths%27_Guild_Weaponry",
    "https://oldschool.runescape.wiki/w/Nardok%27s_Bone_Weapons",
    "https://oldschool.runescape.wiki/w/Quality_Weapons_Shop",
    "https://oldschool.runescape.wiki/w/Vigr%27s_Warhammers",
    "https://oldschool.runescape.wiki/w/Warrior_Guild_Armoury",
    "https://oldschool.runescape.wiki/w/Greengrocer_of_Miscellania",
    "https://oldschool.runescape.wiki/w/Island_Greengrocer",
    "https://oldschool.runescape.wiki/w/Logava_Gricoller%27s_Cooking_Supplies",
    "https://oldschool.runescape.wiki/w/Sawmill_operator",
    "https://oldschool.runescape.wiki/w/Uglug_Nar",
    "https://oldschool.runescape.wiki/w/Keldagrim_Stonemason",
    "https://oldschool.runescape.wiki/w/Razmire_Builders_Merchants.",
    "https://oldschool.runescape.wiki/w/Slayer_Equipment_(shop)",
];

const keys = [
    'icon',
    'item',
    'quantity',
    'restock-time',
    'sell-price',
    'buy-price',
    'ge-price',
];

const allItems = [];
let i = 0;

stores = [...new Set(stores)];

console.log('Loading store data');
console.time('stores');

for(const store of stores){
    i = i + 1;
    console.log(`Loading store ${i} of ${stores.length}`);
    const response = await got(store);
    const $ = cheerio.load(response.body);

    const changeMatch = response.body.match(/Change per: (.+?)%/);
    let changeRate = 1;

    if(!changeMatch){
        console.log(`Couldn't find changerate for ${store}`);
    } else {
        changeRate = parseFloat(changeMatch[1])
    }

    const data = await parseWikiTable($, keys, false, 'item');

    for(const item of data){
        if(!item.item){
            continue;
        }

        allItems.push({
            name: item.item,
            quantity: Number(item.quantity),
            sellPrice: Number(item['sell-price']?.replace(',', '')),
            buyPrice: Number(item['buy-price']?.replace(',', '')),
            // gePrice: Number(item['ge-price']?.replace(',', '')),
            store,
            storeChangeRate: changeRate,
        });
    }
}

const profitableItems = [];

for(const item of allItems){
    if(isNaN(item.sellPrice)){
        continue;
    }

    if(isNaN(item.gePrice)){
        continue;
    }

    const profitRatio = item.gePrice / item.sellPrice;

    if(item.quantity < 1){
        continue;
    }

    if(item.quantity < 100 && profitRatio < 10){
        continue;
    }

    if(profitRatio < 2){
        continue;
    }

    // console.log(item.name, item.quantity, item.sellPrice, item.gePrice, profitRatio);
    profitableItems.push([item.name, item.quantity, item.sellPrice, item.gePrice, profitRatio.toFixed(2), ((item.gePrice - item.sellPrice) * item.quantity).toFixed(0), item.store]);
}

profitableItems.sort((a, b) => b[5] - a[5]);

// console.log(JSON.stringify(allItems, null, 4));
writeFile(join(__dirname, '..', 'src', 'data', 'stores.json'), JSON.stringify(allItems, null, 4));
console.timeEnd('stores');