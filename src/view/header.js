const getHeader = (data) => { 
  return data.map(v => { 
    return {
      field: v.field,
      caption: v.caption,
      headerStyle: {
        padding: '8px',
        textAlign: 'center'
      },
      width: '20%',
      style: rec => {
        return {
          padding: '8px',
          textAlign: 'left',
        }
      }
    }
  })
}
export default getHeader