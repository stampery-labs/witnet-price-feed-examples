import * as Witnet from "witnet-requests"
import * as WitnetSLA from "../../../../../migrations/witnet-slas"

const ultronswap = new Witnet.Source("https://exchange-info.ultron-dev.net/api/v1/ultronswap")
  .parseJSONMap() // Parse a `Map` from the retrieved `String`
  .getMap("0x2318bf5809a72aabadd15a3453a18e50bbd651cd_0x3a4f06431457de873b588846d139ec0d86275d54")
  .getFloat("last_price")
  .power(-1)
  .multiply(10 ** 6)
  .round()

  // Filters out any value that is more than 1.5 times the standard
// deviationaway from the average, then computes the average mean of the
// values that pass the filter.
const aggregator = new Witnet.Aggregator({
    filters: [],
    reducer: Witnet.Types.REDUCERS.mode,
  })
  
  // Filters out any value that is more than 2.5 times the standard
  // deviationaway from the average, then computes the average mean of the
  // values that pass the filter.
  const tally = new Witnet.Tally({
    filters: [
      [Witnet.Types.FILTERS.deviationStandard, 2.5],
    ],
    reducer: Witnet.Types.REDUCERS.averageMedian,
  })
  
  // This is the Witnet.Request object that needs to be exported
  const request = new Witnet.Request()
    .addSource(ultronswap)
    .setAggregator(aggregator) // Set the aggregator function
    .setTally(tally) // Set the tally function
    .setQuorum(WitnetSLA.numWitnesses, WitnetSLA.witnessingQuorum) // Set witness count and minimum consensus percentage
    .setFees(WitnetSLA.witnessReward, WitnetSLA.witnessCommitFee) // Set witness reward and witness commit fee
    .setCollateral(WitnetSLA.witnessCollateral) // Set witness collateral
  
  // Do not forget to export the request object
  export { request as default }