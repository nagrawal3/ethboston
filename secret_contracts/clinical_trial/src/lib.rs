// Built-In Attributes
#![no_std]

// Imports
extern crate eng_wasm;
extern crate eng_wasm_derive;
extern crate serde;

use eng_wasm::*;
use eng_wasm_derive::pub_interface;
use serde::{Serialize, Deserialize};

// Encrypted state keys
static PARTICIPANTS: &str = "participants";

// Structs
#[derive(Serialize, Deserialize)]
pub struct Participant {
    id: U256,
    age: U256,
    real: bool,
    result: Option<U256>,
}

// Public struct Contract which will consist of private and public-facing secret contract functions
pub struct Contract;

// Private functions accessible only by the secret contract
impl Contract {
    fn get_participants() -> Vec<Participant> {
        return read_state!(PARTICIPANTS).unwrap_or_default();
    }
}

// Public trait defining public-facing secret contract functions
#[pub_interface]
pub trait ContractInterface{
    fn add_participant(id: U256, age: U256, real: bool);
    fn get_participant_count() -> U256;
    fn write_result(id: U256, result: U256);
    fn sum_ages() -> U256;
    fn sum_results() -> U256;
    fn compute_avg_result(real: bool) -> U256;
    // fn computePlaceboResult() -> U256;
    // fn computeRealResult(age: U8, overunder: bool) -> U256;
    // fn computePlaceboResult(age: U8, overunder: bool) -> U256;
}

// Implementation of the public-facing secret contract functions defined in the ContractInterface
// trait implementation for the Contract struct above
impl ContractInterface for Contract {
    #[no_mangle]
    fn add_participant(id: U256, age: U256, real: bool) {
        let mut participants = Self::get_participants();
        participants.push(Participant {
            id,
            age,
            real,
            result: None,
        });
        write_state!(PARTICIPANTS => participants);
    }

    #[no_mangle]
    fn get_participant_count() -> U256 {
        let participants = Self::get_participants();
        return U256::from(participants.len());
    }

    #[no_mangle]
    fn write_result(_id: U256, _result: U256) {
        let mut participants = Self::get_participants();

        for mut participant in &mut participants {
            if _id == participant.id {
                participant.result = Some(_result);
            }
        }
        write_state!(PARTICIPANTS => participants);
    }

    #[no_mangle]
    fn sum_ages() -> U256 {
        let participants = Self::get_participants();
        let mut sum: U256 = U256::from(0);
        for participant in participants {
            sum += participant.age;
        }
        return sum;
    }

    #[no_mangle]
    fn sum_results() -> U256 {
        let participants = Self::get_participants();
        let mut sum: U256 = U256::from(0);
        for participant in participants {
            sum += participant.result.unwrap();
        }
        return sum;
    }

    fn compute_avg_result(_real: bool) -> U256 {
        let participants = Self::get_participants();
        let mut sum: U256 = U256::from(0);
        let mut count: U256 = U256::from(0);
        for participant in participants {
            if participant.real == _real {
                sum += participant.result.unwrap();
                count = count + 1;
            }
        }
        let calculation: U256 = sum / count;
        return calculation;
    }
}
