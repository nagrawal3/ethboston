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
        read_state!(PARTICIPANTS).unwrap_or_default()
    }
    /*
    fn get_participant(index: U256) -> Participant {
        let mut participants = read_state!(PARTICIPANTS).unwrap_or_default()
        return participants[index];
    }
    */
}

// Public trait defining public-facing secret contract functions
#[pub_interface]
pub trait ContractInterface{
    fn add_participant(id: U256, age: U256, real: bool);
    fn get_participant_count() -> U256;
    // fn write_result(id: u256, result: U256);
    // fn computeRealResult() -> U256;
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

    /*
    #[no_mangle]
    fn write_results(id: U256, age: U8, real: bool) {
        let mut participants = Self::get_millionaires();
        participants.push(Participant {
            id,
            age,
            real,
        });
        write_state!(MILLIONAIRES => millionaires);
    }

    #[no_mangle]
    fn compute_richest() -> H160 {
        match Self::get_millionaires().iter().max_by_key(|m| m.net_worth) {
            Some(millionaire) => {
                millionaire.address
            },
            None => H160::zero(),
        }
    }
    */
}
