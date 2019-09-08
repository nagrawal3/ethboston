const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const {Enigma, utils, eeConstants} = require('enigma-js/node');

var EnigmaContract;
if(typeof process.env.SGX_MODE === 'undefined' || (process.env.SGX_MODE != 'SW' && process.env.SGX_MODE != 'HW' )) {
    console.log(`Error reading ".env" file, aborting....`);
    process.exit();
} else if (process.env.SGX_MODE == 'SW') {
  EnigmaContract = require('../build/enigma_contracts/EnigmaSimulation.json');
} else {
  EnigmaContract = require('../build/enigma_contracts/Enigma.json');
}
const EnigmaTokenContract = require('../build/enigma_contracts/EnigmaToken.json');


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let enigma = null;
let contractAddr;

contract("ClinicalTrial", accounts => {
  before(function() {
    enigma = new Enigma(
      web3,
      EnigmaContract.networks['4447'].address,
      EnigmaTokenContract.networks['4447'].address,
      'http://localhost:3346',
      {
        gas: 4712388,
        gasPrice: 100000000000,
        from: accounts[0],
      },
    );
    enigma.admin();

    contractAddr = fs.readFileSync('test/clinical_trial.txt', 'utf-8');
  });

  let task;

  // ADDING FIRST PARTICIPANT
  // ID 1
  // Age 65
  // real 1 [REAL MEDICINE]
  it('should execute compute task to add the first participant', async () => {
    let taskFn = 'add_participant(uint256, uint256, bool)';
    let taskArgs = [
      [1, 'uint256'],
      [65, 'uint256'],
      [1, 'bool'],
    ];
    let taskGasLimit = 6721900;
    let taskGasPx = utils.toGrains(1);
    task = await new Promise((resolve, reject) => {
      enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, accounts[0], contractAddr)
          .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
          .on(eeConstants.ERROR, (error) => reject(error));
    });
  });

  it('should get the pending task', async () => {
    task = await enigma.getTaskRecordStatus(task);
    expect(task.ethStatus).to.equal(1);
  });

  it('should get the confirmed task', async () => {
    do {
      await sleep(1000);
      task = await enigma.getTaskRecordStatus(task);
      process.stdout.write('Waiting. Current Task Status is '+task.ethStatus+'\r');
    } while (task.ethStatus !== 2);
    expect(task.ethStatus).to.equal(2);
    process.stdout.write('Completed. Final Task Status is '+task.ethStatus+'\n');
  }, 10000);

  // ADDING SECOND PARTICIPANT
  // ID 2
  // Age 85
  // real 0 [PLACEBO]
  it('should execute compute task to add the second participant', async () => {
    let taskFn = 'add_participant(uint256, uint256, bool)';
    let taskArgs = [
      [2, 'uint256'],
      [85, 'uint256'],
      [0, 'bool'],
    ];
    let taskGasLimit = 6721900;
    let taskGasPx = utils.toGrains(1);
    task = await new Promise((resolve, reject) => {
      enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, accounts[0], contractAddr)
          .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
          .on(eeConstants.ERROR, (error) => reject(error));
    });
  });

  it('should get the pending task', async () => {
    task = await enigma.getTaskRecordStatus(task);
    expect(task.ethStatus).to.equal(1);
  });

  it('should get the confirmed task', async () => {
    do {
      await sleep(1000);
      task = await enigma.getTaskRecordStatus(task);
      process.stdout.write('Waiting. Current Task Status is '+task.ethStatus+'\r');
    } while (task.ethStatus !== 2);
    expect(task.ethStatus).to.equal(2);
    process.stdout.write('Completed. Final Task Status is '+task.ethStatus+'\n');
  }, 10000);

  // ADDING THIRD PARTICIPANT
  // ID 3
  // Age 52
  // real 1 [REAL]
  it('should execute compute task to add the third participant', async () => {
    let taskFn = 'add_participant(uint256, uint256, bool)';
    let taskArgs = [
      [3, 'uint256'],
      [52, 'uint256'],
      [1, 'bool'],
    ];
    let taskGasLimit = 6721900;
    let taskGasPx = utils.toGrains(1);
    task = await new Promise((resolve, reject) => {
      enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, accounts[0], contractAddr)
          .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
          .on(eeConstants.ERROR, (error) => reject(error));
    });
  });

  it('should get the pending task', async () => {
    task = await enigma.getTaskRecordStatus(task);
    expect(task.ethStatus).to.equal(1);
  });

  it('should get the confirmed task', async () => {
    do {
      await sleep(1000);
      task = await enigma.getTaskRecordStatus(task);
      process.stdout.write('Waiting. Current Task Status is '+task.ethStatus+'\r');
    } while (task.ethStatus !== 2);
    expect(task.ethStatus).to.equal(2);
    process.stdout.write('Completed. Final Task Status is '+task.ethStatus+'\n');
  }, 10000);

  // ADDING FOURTH PARTICIPANT
  // ID 4
  // Age 29
  // real 0 [Placebo]
  it('should execute compute task to add the fourth participant', async () => {
    let taskFn = 'add_participant(uint256, uint256, bool)';
    let taskArgs = [
      [4, 'uint256'],
      [29, 'uint256'],
      [0, 'bool'],
    ];
    let taskGasLimit = 6721900;
    let taskGasPx = utils.toGrains(1);
    task = await new Promise((resolve, reject) => {
      enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, accounts[0], contractAddr)
          .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
          .on(eeConstants.ERROR, (error) => reject(error));
    });
  });

  it('should get the pending task', async () => {
    task = await enigma.getTaskRecordStatus(task);
    expect(task.ethStatus).to.equal(1);
  });

  it('should get the confirmed task', async () => {
    do {
      await sleep(1000);
      task = await enigma.getTaskRecordStatus(task);
      process.stdout.write('Waiting. Current Task Status is '+task.ethStatus+'\r');
    } while (task.ethStatus !== 2);
    expect(task.ethStatus).to.equal(2);
    process.stdout.write('Completed. Final Task Status is '+task.ethStatus+'\n');
  }, 10000);


  // GET NUMBER OF PARTICIPANTS
  it('should execute get number of participants', async () => {
      let taskFn = 'get_participant_count()';
      let taskArgs = [];
      let taskGasLimit = 500000;
      let taskGasPx = utils.toGrains(1);
      task = await new Promise((resolve, reject) => {
          enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, accounts[0], contractAddr)
              .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
              .on(eeConstants.ERROR, (error) => reject(error));
      });
  });

  it('should get the pending task', async () => {
      task = await enigma.getTaskRecordStatus(task);
      expect(task.ethStatus).to.equal(1);
  });

  it('should get the confirmed task', async () => {
      do {
          await sleep(1000);
          task = await enigma.getTaskRecordStatus(task);
          process.stdout.write('Waiting. Current Task Status is '+task.ethStatus+'\r');
      } while (task.ethStatus !== 2);
      expect(task.ethStatus).to.equal(2);
      process.stdout.write('Completed. Final Task Status is '+task.ethStatus+'\n');
  }, 10000);

  it('should get the result and verify the computation is correct', async () => {
    task = await new Promise((resolve, reject) => {
      enigma.getTaskResult(task)
        .on(eeConstants.GET_TASK_RESULT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
    expect(task.engStatus).to.equal('SUCCESS');
    task = await enigma.decryptTaskResult(task);
    expect(web3.eth.abi.decodeParameters([{
        type: 'uint256',
        name: 'participantCount',
    }], task.decryptedOutput).participantCount).to.equal('3');
  });
});
