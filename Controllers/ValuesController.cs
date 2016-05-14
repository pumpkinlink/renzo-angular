using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;

namespace scripts_prog_crud_ajax_webapi.Controllers
{
    public class TaskList
    {
        private string[] pending = new string[0], done = new string[0];
        public string[] Pending
        {
            get{ return pending; }
            set{ pending = value ?? new string[0]; }
        }
        public string[] Done
        {
            get{ return done; }
            set{ done = value ?? new string[0]; }
        }
    }

    [Route("api/[controller]")]
    public class ValuesController: Controller
    {
        // GET: api/values
        [HttpGet]
        //public IEnumerable<string> Get()
        public object Get()
        {
            //return new string[] { System.IO.File.ReadAllText("./tasks.json") };
            var file = System.IO.File.ReadAllText("./tasks.json");
            var json = JsonConvert.DeserializeObject<TaskList>(file);
            return json;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post(TaskList value)
        {
            System.IO.File.WriteAllText("./tasks.json", JsonConvert.SerializeObject(value));
            System.Console.WriteLine("VALOR:'" + JsonConvert.SerializeObject(value) + "'");
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
