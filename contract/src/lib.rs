#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, String, symbol_short,
};

#[contracttype]
#[derive(Clone)]
pub struct DonorRecord {
    pub address: Address,
    pub blood_type: String,
    pub location: String,
    pub registered_at: u64,
    pub is_available: bool,
}

#[contract]
pub struct BloodChainRegistry;

#[contractimpl]
impl BloodChainRegistry {

    /// Register a new donor. Re-registration updates the existing record.
    pub fn register_donor(
        env: Env,
        donor: Address,
        blood_type: String,
        location: String,
    ) -> bool {
        donor.require_auth();

        let is_new = !env.storage().persistent().has(&donor);

        let record = DonorRecord {
            address: donor.clone(),
            blood_type,
            location,
            registered_at: env.ledger().timestamp(),
            is_available: true,
        };

        env.storage().persistent().set(&donor, &record);

        if is_new {
            let count: u32 = env
                .storage()
                .instance()
                .get(&symbol_short!("COUNT"))
                .unwrap_or(0u32);
            env.storage()
                .instance()
                .set(&symbol_short!("COUNT"), &(count + 1));
        }

        env.events().publish(
            (symbol_short!("REGISTER"),),
            donor,
        );

        true
    }

    /// Look up a donor by address.
    pub fn get_donor(env: Env, donor: Address) -> Option<DonorRecord> {
        env.storage().persistent().get(&donor)
    }

    /// Return the total number of registered donors.
    pub fn get_donor_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&symbol_short!("COUNT"))
            .unwrap_or(0u32)
    }

    /// Toggle donor availability (donor must authorize).
    pub fn set_availability(env: Env, donor: Address, available: bool) -> bool {
        donor.require_auth();
        if let Some(mut record) = env.storage().persistent().get::<Address, DonorRecord>(&donor) {
            record.is_available = available;
            env.storage().persistent().set(&donor, &record);
            true
        } else {
            false
        }
    }
}
