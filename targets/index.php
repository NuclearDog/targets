<?php

/* Settings */
// Database connection information
const DB_DSN = 'mysql:host=localhost;dbname=targets';
const DB_USR = 'root';
const DB_PWD = 'root';
// Whether redbean can update the database schema
const DB_FREEZE = false;

// A list of valid objects (these are your table names)
const OBJECTS = ['location', 'shot', 'target', 'targettype', 'trip'];
// A list of objects that will be READ ONLY: CREATE, UPDATE and DESTROY will be
// disabled for these objects.
const READONLY = ['targettype'=>true, 'location'=>true];
// Whether we should allow 'DANGEROUS' operations - for example, DESTROY'ing
// all instances of an object on "DELETE /object", emptying the table or
// "PUT /object", replacing all objects.
const ALLOW_DANGEROUS = false;



/* Load Files */
require(__DIR__.'/rb.php');
require(__DIR__.'/Request.php');
require(__DIR__.'/Response.php');



/* Setup the Database */
\R::setup(DB_DSN, DB_USR, DB_PWD);
\R::freeze(DB_FREEZE);



/* Collect the Request */
if (!($request = Request::create()))
{
	\Response::error(400);
}



/* Validate the request, roughly */
// Make sure the object is valid
if (!in_array($request->getObject(), OBJECTS))
{
	\Response::error(400);
}

// If the object is marked read only, then don't allow CREATE/UPDATE/DESTROY.
if (in_array($request->getOperation(), [
		\Request::OP_CREATE,
		\Request::OP_UPDATE,
		\Request::OP_DESTROY
	]) &&
	in_array($request->getObject(), array_keys(READONLY)) && READONLY[$request->getObject()]
	)
{
	\Response::error(403);
}



/* Figure out what to do based on op/instance */

// code, status, message?
// 2xx = success
// 4xx = fail
// 5xx = error
$response = new \Response();

// Start a database transactions
\R::begin();
try
{

	switch ($request->getOperation())
	{
		case \Request::OP_CREATE:
			$bean = \R::dispense($request->getObject());
			foreach ($request->getData() as $k=>$v)
				$bean->$k = $v;
			\R::store($bean);
			$response->setData(\R::exportAll($bean)[0]);
			break;


		case \Request::OP_READ:
			if ($request->hasInstance())
			{
				$bean = \R::load($request->getObject(), $request->getInstance());
				if ($bean->id == 0)
				{
					\Response::error(404);
				}
				$response->setData(\R::exportAll($bean)[0]);
			}
			else
			{
				// Load all beans
				$data = $request->getData();
				if (sizeof($data) == 0)
				{
					$beans = array_values(\R::find($request->getObject(), '1', []));
				}
				else
				{
					$sql = [];
					$vals = [];

					foreach ($data as $k=>$v)
					{
						if (!preg_match('/^[A-Za-z0-9_]+$/', $k))
							\Response::error(400);
						$sql[] = '`'.$k.'` = ?';
						$vals[] = $v;
					}

					$beans = array_values(\R::find($request->getObject(), implode(' AND ', $sql), $vals));
				}

				$response->setData(\R::exportAll($beans));
			}
			break;


		case \Request::OP_UPDATE:
			if ($request->hasInstance())
			{
				$bean = \R::load($request->getObject(), $request->getInstance());
				if ($bean->id == 0)
				{
					\Response::error(404);
				}

				foreach ($bean as $k=>$v)
					$bean->$k = null;
				foreach ($request->getData() as $k=>$v)
					$bean->$k = $v;

				\R::store($bean);
			}
			else
			{
				if (!ALLOW_DANGEROUS)
				{
					\Response::error(405);
				}

				$beans = \R::find($request->getObject(), '1', []);
				foreach ($beans as $bean)
					\R::trash($bean);

				$data = $request->getData();
				for ($i=0; $i<sizeof($data->{array_keys($data)[0]}); $i++)
				{
					$bean = \R::dispense($request->getObject());
					foreach ($data as $k=>$v)
					{
						$bean->$k = $v[$i];
					}
					\R::store($bean);
				}
			}

			break;


		case \Request::OP_DESTROY:
			if ($request->hasInstance())
			{
				// Delete as single bean
				$bean = \R::load($request->getObject(), $request->getInstance());
				if ($bean->id == 0)
				{
					\Response::error(404);
				}
				\R::trash($bean);
			}
			else
			{
				if (!ALLOW_DANGEROUS)
				{
					\Response::error(405);
				}

				$beans = array_values(\R::find($request->getObject(), '1', []));

				if (sizeof($beans) == 0)
				{
					\Response::error(404);
				}

				foreach ($beans as $bean)
				{
					\R::trash($bean);
				}
			}
			break;


	}

	\R::commit();

}
catch (\Throwable $ex)
{
	\R::rollback();
	\Response::error(500, $ex->getMessage());
}
catch (\Exception $ex)
{
	\R::rollback();
	\Response::error(500, $ex->getMessage());
}


$response->output();

?>