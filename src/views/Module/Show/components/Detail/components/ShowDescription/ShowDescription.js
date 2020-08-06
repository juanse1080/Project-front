import React from 'react'
import { makeStyles, Icon, Chip, Tab, Tabs, Typography, Tooltip, Link } from '@material-ui/core'

import { title, format_date } from 'utils'

export default function Detail({ module }) {

  return <>
    <Typography >{module.description}</Typography>
    <Typography className="mt-3 mb-2 text-secondary">
      <span className="mr-1">Owner:</span>
      <Link>{title(`${module.user.first_name} ${module.user.last_name}`)}</Link>
    </Typography>
    
    <Typography></Typography>
    {
      module.extensions ? <>
        <Typography className="mt-3 mb-2 text-secondary">Extensions:</Typography>
        {
          module.extensions.split(' ').map(extension =>
            <Chip key={extension} label={extension} className="m-1" />
          )
        }
      </> : null
    }
  </>
}
