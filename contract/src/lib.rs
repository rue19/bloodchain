#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, symbol_short};

#[contract]
pub struct BloodChainRegistry;

#[contractimpl]
impl BloodChainRegistry {
    pub fn register_donor(
        env: Env,
        donor: Address,
        blood_type: String,
        location: String,
    ) -> bool {
        donor.require_auth();

        let is_new = !env.storage().persistent().has(&donor);

        // Store blood type
        env.storage().persistent().set(&donor, &blood_type);

        if is_new {
            let count_key = symbol_short!("COUNT");
            let current_count: u32 = env
                .storage()
                .instance()
                .get::<_, u32>(&count_key)
                .unwrap_or(0);
            env.storage()
                .instance()
                .set::<_, u32>(&count_key, &(current_count + 1));
        }

        env.events().publish((symbol_short!("REGISTER"),), donor);
        true
    }

    pub fn get_donor_count(env: Env) -> u32 {
        let count_key = symbol_short!("COUNT");
        env.storage()
            .instance()
            .get::<_, u32>(&count_key)
            .unwrap_or(0)
    }
}
