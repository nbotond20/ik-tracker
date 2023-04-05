export function transformObjects(arr) {
  const transformedArr = arr.map(obj => {
    const { preRequirements1, preRequirements2, code } = obj
    let newPreReqArr = []

    // handle preRequirements1
    if (preRequirements1) {
      const preReq1Arr = preRequirements1.split(' vagy ')
      const type = preReq1Arr[0].includes('(gyenge)') ? 0 : 1
      const code = preReq1Arr[0].replace('(gyenge)', '')
      const orArr = preReq1Arr.length > 1 ? preReq1Arr.filter(p => p !== preReq1Arr[0]) : null
      const preReq1Obj = { code, type, or: orArr }
      newPreReqArr.push(preReq1Obj)
    }

    // handle preRequirements2
    if (preRequirements2) {
      const preReq2Arr = preRequirements2.split(' vagy ')
      const type = preReq2Arr[0].includes('(gyenge)') ? 0 : 1
      const code = preReq2Arr[0].replace('(gyenge)', '')
      const orArr = preReq2Arr.length > 1 ? preReq2Arr.filter(p => p !== preReq2Arr[0]) : null
      const preReq2Obj = { code, type, or: orArr }
      newPreReqArr.push(preReq2Obj)
    }

    // remove preRequirements2 key
    delete obj.preRequirements2

    return { ...obj, preRequirements1: newPreReqArr, code }
  })

  return transformedArr
}
